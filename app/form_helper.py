import json

def create_form(zid):
    with open(f'app/form_responses/form_template.json') as template_file:
        template_json = json.load(template_file)
        template_json['zid'] = str(zid)
        save_form(zid, template_file)

def get_form(zid):
    try:
        with open(f'app/form_responses/{zid}.json') as form_response_file:
            return json.load(form_response_file)
    except:
        create_form(zid)
        with open(f'app/form_responses/{zid}.json') as form_response_file:
            return json.load(form_response_file)

def save_form(zid, response_dict):
    with open(f'app/form_responses/{zid}.json', 'w') as zid_file:
        json.dump(response_dict, zid_file, indent=4)