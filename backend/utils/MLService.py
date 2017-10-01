import urllib.request, urllib.error, urllib.parse
import json
import backend.utils.util


def process_request(self, request):
    name = request.GET.get('name', 'noname')
    gender = request.GET.get('gender', 'F')
    age_range = request.GET.get('age_range', {'min':' 30'})
    age = '30'
    for (k,v) in age_range:
        age = v
    hometown = request.GET.get('hometown', 'montreal')
    depression = "0"

    imageUrl = request.GET.get('img','')
    messages = request.GET.get('message',{})
    profileScore = "50"
    photoScore = []

    #get profile picture
    if imageUrl !="":
        profileScore = util.AnalyzeProfileImage(imageUrl)

    #group all messages
    listOfStrings = []
    for (k,message) in messages:
        listOfStrings.append(message)
    #create doc for messages
    doc  = util.CreateDocuments(listOfStrings)
    #query sentiment text api
    res = util.AnalyzeText(doc)
    #populate text score
    for e in res['documents']:
        photoScore.append(e['score'])
    #fill list with 50s
    if photoScore.count() < 10:
        for x in range (0, 10 - photoScore.count()):
            photoScore.append("50")


    input ={
        'Name': name,
        'Gender': gender,
        'Age': age,
        'HomeTown': hometown,
        'Profile Score': profileScore,
    }
    count = 1;
    for y in photoScore:
        input["Photo"+str(count)] = y
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
    ans = GetMLPrediction(data)
    return json.loads(ans)["Results"]["output1"][0]["Scored Labels"]



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
        print(result)
        return result
    except urllib.error.HTTPError as error:
        print(("The request failed with status code: " + str(error.code)))

        # Print the headers - they include the requert ID and the timestamp, which are useful for debugging the failure
        print((error.info()))
        print((json.loads(error.read())))