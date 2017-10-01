from rest_framework.response import Response
from rest_framework.views import APIView
from backend.utils.MLService import process_ml_request


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


class AiView(APIView):

    authentication_classes = ()
    permission_classes = ()

    def get(self, request):
        GetMLPrediction(myData)
        return Response("HELLO")

    def post(self, request):
        #print(request.data)
        result = process_ml_request(request.data)
        print(result)
        return Response(dict(result=result))