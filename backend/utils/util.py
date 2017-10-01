#!/usr/bin/python
import sys, http.client, urllib.request, urllib.parse, urllib.error, json,time
from random import randint
from pprint import pprint


def AnalyzeProfileImage(url):
    # setup request
    headers = {
        # Request headers. Replace the placeholder key below with your subscription key.
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': '9303e97b88b9465ea2d53d34d6f132b2',
    }
    params = urllib.parse.urlencode({
    })

    # Replace the example URL below with the URL of the image you want to analyze.
    body = "{ 'url': '" + url + "' }"

    try:
        # NOTE: You must use the same region in your REST call as you used to obtain your subscription keys.
        #   For example, if you obtained your subscription keys from westcentralus, replace "westus" in the
        #   URL below with "westcentralus".
        conn = http.client.HTTPSConnection('westus.api.cognitive.microsoft.com')
        conn.request("POST", "/emotion/v1.0/recognize?%s" % params, body, headers)
        response = conn.getresponse()
        data = response.read()

        parsed = json.loads(data)
        sum = 0
        count = 0
        for face in parsed:
            # add all negative
            negative = face['scores']['sadness'] + face['scores']['disgust'] + face['scores']['anger'] + face['scores'][
                'fear'] + face['scores']['contempt']
            sum += negative
            count += 1
        if count != 0:
            averageNegative = sum * 100 / count
        else:
            return 100
        conn.close()
        return averageNegative
    except Exception as e:
        print(("[Errno {0}] {1}".format(e.errno, e.strerror)))


def GetImageDescription(url):
    # END POINT: https://westcentralus.api.cognitive.microsoft.com/vision/v1.0
    subscription_key = '0074d29c97814c2e91d447e05442e778'
    uri_base = 'westcentralus.api.cognitive.microsoft.com'

    headers = {
        # Request headers.
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Key': subscription_key,
    }

    params = urllib.parse.urlencode({
        # Request parameters. All of them are optional.
        'visualFeatures': 'Categories,Description,Color',
        'language': 'en',
    })

    body = "{ 'url': '" + url + "' }"
    try:
        # Execute the REST API call and get the response.
        conn = http.client.HTTPSConnection('westcentralus.api.cognitive.microsoft.com')
        conn.request("POST", "/vision/v1.0/analyze?%s" % params, body, headers)
        response = conn.getresponse()
        data = response.read()

        # 'data' contains the JSON data. The following formats the JSON data for display.
        parsed = json.loads(data)
        description = parsed["description"]["captions"][0]
        text = description["text"]
        tags = parsed["description"]["tags"]
        result = text
        for tag in tags:
            result += " " + tag
        conn.close()
        return result

    except Exception as e:
        print('(Request limit reached, sleeping for 20 Sec ...)')
        time.sleep(20)
        GetImageDescription(url)


def AnalyzeText(documents):
    # https://westcentralus.api.cognitive.microsoft.com/text/analytics/v2.0
    # accessKey = '4ac50a233e4244258b3deca130501808'

    accessKey = '4ac50a233e4244258b3deca130501808'

    uri = 'westcentralus.api.cognitive.microsoft.com'
    path = '/text/analytics/v2.0/sentiment'

    headers = {'Ocp-Apim-Subscription-Key': accessKey}
    conn = http.client.HTTPSConnection(uri)
    body = json.dumps({"documents": documents})
    conn.request("POST", path, body, headers)
    response = conn.getresponse()
    return json.loads(response.read())


# assume language in english
def CreateDocuments(listOfStrings):
    dcm = []
    id = 1
    for string in listOfStrings:
        dcm.append({'id': str(id), 'language': 'en', 'text': str(string)})
        id += 1
    return dcm


def AnalyzeImage(urls):
    Descriptions = []
    for url in urls:
        Descriptions.append(GetImageDescription(url))
    response = AnalyzeText(CreateDocuments(Descriptions))
    result = ""
    for e in response["documents"]:
        result += "," + str(e["score"] * 100)
    return result


def file_len(fname):
    return sum(1 for line in fname)


def main(argv):
    if len(argv) < 2:
        print("Usage [Operation] {filenames1,filenames2,...}")
        exit(1)

    if argv[1] == '-M':
        ofile = open("MERGED_DATA.csv", "w")
        header = ""
        for fileN in range(1, len(argv)):
            file = open(argv[fileN], "r")
            fheader = file.readline()
            if fileN == 1:
                header = fheader
                ofile.write(header)
            else:
                if header != fheader:
                    print("Non compatible files!")
                    exit(1)

            for line in file:
                ofile.write(line)

    elif argv[1] == '-G':
        if len(argv) < 3:
            print("File not specified")
            exit(1)
        ifile = open(argv[2], "r")
        iflen = file_len(open(argv[2], "r"))
        ofile = open(argv[2].split(".")[0] + "_WITH_PHOTO_URL." + argv[2].split(".")[1], "a")
        oflen = file_len(open(argv[2].split(".")[0] + "_WITH_PHOTO_URL." + argv[2].split(".")[1], "r"))
        if oflen == 0:
            ofile.write(
                ifile.readline().rstrip() + ",Profile Score,Photo1 Score,Photo2 Score,Photo3 Score,Depression\n")
            oflen+=1

        for line in range(0, oflen):
            ifile.readline()
            iflen-=1

        i = 1
        for line in ifile:
            print(("Processing line %d/%d" % (i, iflen)))
            line = line.rstrip()
            gender = line.split(",")[1]
            g = ""
            if gender == 'M':
                g = "men"
            elif gender == 'F':
                g = "women"

            imageDes = AnalyzeImage(["http://lorempixel.com/400/400/", "http://lorempixel.com/400/400/",
                                     "http://lorempixel.com/400/400/"])
            profileDes = str(AnalyzeProfileImage(
                "https://randomuser.me/api/portraits/" + str(g) + "/" + str(randint(0, 99)) + ".jpg"))
            s = (line + "," + profileDes + imageDes + "," + str(randint(1, 100)) + "\n")
            ofile.write(s)
            i += 1
        ifile.close()


if __name__ == "__main__":
    main(sys.argv)
