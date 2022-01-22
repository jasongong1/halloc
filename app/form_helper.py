import json

def create_form(zid):
    with open(f'form_responses/form_template.json') as template_file:
        template_json = json.load(template_file)
        with open(f'form_responses/{zid}.json', 'w') as zid_file:
            template_json['zid'] = str(zid)
            print(template_json)
            json.dump(template_json, zid_file)

def get_response(zid):
    with open(f'form_responses/{zid}.json') as form_response_file:
        return json.load(form_response_file)
    