#!/usr/bin/python
from random import randint
import sys


def main(argv):
    if len(argv) < 2:
        print("File not specified")
        exit(1)
    ifile = open(argv[1], "r")
    ofile = open(argv[1].split(".")[0] + "_WITH_PHOTO_URL." + argv[1].split(".")[1], "w")
    ofile.write(ifile.readline().rstrip() + ",Profile Score,Photo1 Score,Photo2 Score,Photo3 Score,Depression\n")
    for line in ifile:
        line = line.rstrip()
        gender = line.split(",")[4]
        print(gender)

        if gender == "Male":
            gender = "men"
        elif gender == "Female":
            gender = "women"

        s = (line + ",https://randomuser.me/api/portraits/" + gender + "/" + str(randint(1, 100)) + ".jpg,"
             + 3 * "http://lorempixel.com/400/400/,"
             + str(randint(1, 100)) + '\n')
        ofile.write(s)


if __name__ == "__main__":
    main(sys.argv)
