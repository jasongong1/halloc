from multiprocessing import synchronize
import os, sys
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from app import db, create_app
from flask import current_app
from app.models import College, Room, Floor, Preference, UserCollegeJoin
import csv

def load_hall_csv_to_db():
    app=create_app()
    with app.app_context():
        college_id = -1

        # create college and get college_id

        # check if college exists
        college = College.query.filter(College.college_name.like("hall")).first()
        # college already exists
        if college:
            if yes_or_no('A college named "Hall" already exists; reset all associated data? '):
                college_id = college.id
                floor_query = Floor.query.filter(Floor.college_id == college.id)
                floor_subquery = db.session.query(Floor.id).filter(Floor.college_id == college.id)
                room_query = Room.query.filter(Room.floor_id.in_(floor_subquery.scalar_subquery()))
                room_subquery = db.session.query(Room.id).filter(Room.floor_id.in_(floor_subquery.scalar_subquery()))
                preference_query = Preference.query.filter(Preference.room_id.in_(room_subquery.scalar_subquery()))

                preference_query.delete(synchronize_session=False)
                room_query.delete(synchronize_session=False)
                floor_query.delete(synchronize_session=False)

                db.session.commit()
            else:
                return
        # college doesn't exist in db yet
        else:
            new_college = College(
                college_name = "Hall"
            )
            db.session.add(new_college)
            db.session.commit()

            college_id = College.query.filter(College.college_name.like("hall")).first().id

        floor_ids = {
            "1": None,
            "2": None,
            "3": None,
            "4": None,
            "5": None,
            "6": None,
            "7": None
        }

        for floor in floor_ids:
            if not Floor.query.filter(Floor.floor_level == floor and floor.college_id == college_id).first():
                db.session.add(Floor(
                    floor_level = floor,
                    college_id = college_id
                ))
                db.session.commit()
            floor_ids[floor] = Floor.query.filter(Floor.floor_level == floor and floor.college_id == college_id).first().id

        with open('hall_rooms.csv', 'r') as rooms_csv:
            csv_reader = csv.reader(rooms_csv)
            next(csv_reader)
            for row in csv_reader:
                if not row:
                    continue
                row_room_name = str(row[0])
                row_floor = str(row[1])
                row_selectable = int(row[2])
                row_room_type = str(row[3]) if len(row) > 3 else ''
                db.session.add(Room(
                    room_name = row_room_name,
                    room_type = row_room_type,
                    college_id = college_id,
                    floor_id = floor_ids[row_floor],
                    selectable = row_selectable                    
                ))
            db.session.commit()

def yes_or_no(question):
    answer = input(question + "(y/n): ").lower().strip()
    while not(answer == "y" or answer == "yes" or \
    answer == "n" or answer == "no"):
        print("Input yes or no")
        answer = input(question + "(y/n):").lower().strip()
        print("")
    if answer[0] == "y":
        return True
    else:
        return False

if __name__ == "__main__":
    load_hall_csv_to_db()