import urllib.request, urllib.error, urllib.parse
import json
from backend.utils.util import AnalyzeProfileImage, AnalyzeText, CreateDocuments


def process_ml_request(data):
    name = data['name'] if data['name']!="" else "Default"
    gender = data['gender'] if data['gender'] !="" else "F"
    age_range = data['age_range'] if data['age_range']!="" else {"max":"30"}
    age = '30'
    for (k,v) in age_range.items():
        age = v
    hometown = data['hometown'] if data['hometown'] !="" else "Montreal"
    depression = "0"

    imageUrl = data['img']
    messages = data['message'] if data['message']!="" else [] 
    profileScore = "50"
    photoScore = []

    #get profile picture
    if imageUrl !="":
        profileScore = AnalyzeProfileImage(imageUrl)

    #group all messages

    listOfStrings = []
    for (k,message) in messages.items():
        listOfStrings.append(message)
    #query sentiment text api
    res = AnalyzeText(CreateDocuments(listOfStrings))
    #populate text score
    for e in res['documents']:
         photoScore.append(e['score'])
    #fill list with 50s
    if len(photoScore) < 3:
        for x in range (0, 3 - len(photoScore)):
            photoScore.append("50")

    input ={
        'Name': name,
        'Gender': gender,
        'Age': age,
        'HomeTown': hometown,
        'Profile Score': profileScore,
        'Depression': depression
    }
    count = 1;
    for y in photoScore:
        input["Photo"+str(count)+" Score"] = y
        if count == 3:
            break
        count+=1


    data = {
        "Inputs": {
            "input1":
                [
                    input
                ],
        },
        "GlobalParameters":  {
        }
    } 
    print(data)
    ans = GetMLPrediction(data)
    if ans:
        # decodedStr = ans.read().decode("utf-8")
        return json.loads(ans.decode("utf-8"))["Results"]["output1"][0]["Scored Labels"]
    else:
        return '0.5'



##FORMAT OF THE DATA
# myData = {
#         "Inputs": {
#                 "input1":
#                 [
#                     {
#                             'Name': "Aimee ",
#                             'Gender': "F",
#                             'Age': "22",
#                             'HomeTown': "Lima",
#                             'Profile Score': "45",
#                             'Photo1 Score': "45",
#                             'Photo2 Score': "45",
#                             'Photo3 Score': "45",
#                             'Depression': "0",
#                     }
#                 ],
#         },
#     "GlobalParameters":  {
#     }
# }
def GetMLPrediction (data):

    body = str.encode(json.dumps(data))

    url = 'https://ussouthcentral.services.azureml.net/workspaces/628af30e9c7d47c38cf143ba34475ad7/services/9e1c8287f4f54205bb1b93550306d92b/execute?api-version=2.0&format=swagger'

    api_key = 'hixzm93iPvM1SAYdXP8YzdW3VMLhXHh7FD5xvJ2k1qwi8EGv0Wrb+KfYoqu0iT7PgM/sKJzX4/ZVvhdAmxKDQA==' # Replace this with the API key for the web service

    headers = {'Content-Type':'application/json', 'Authorization':('Bearer '+ api_key)}

    req = urllib.request.Request(url, body, headers)

    try:
        response = urllib.request.urlopen(req)

        result = response.read()
        return result
    except urllib.error.HTTPError as error:
        print(("The request failed with status code: " + str(error.code)))

        # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
        print((error.info()))
        decodedStr = error.read().decode("utf-8")
        print((json.loads(decodedStr)))
        return ""