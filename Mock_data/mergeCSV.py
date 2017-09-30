#!/usr/bin/python
import sys


def main(argv):
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


if __name__ == "__main__":
    main(sys.argv)
