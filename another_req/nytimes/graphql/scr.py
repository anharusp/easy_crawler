import os
import shutil
from pathlib import *


def getnum(inputstr):
    return(int(inputstr[:len(inputstr)-4]))

current_dir = Path.cwd()

dir = current_dir +"/"
files = os.listdir(dir)
textlist = list(filter(lambda x : x.endswith('.txt'), files))


# print(sorted(textlist, key = getnum))
num = 0
textlist = sorted(textlist, key = getnum)
# print(textlist)
# rename
for i in textlist:
    os.rename(dir+i, dir+str(num)+'.txt')
    num = num + 1

# for i in textlist:
#     with open(dir+i) as f:
#         line = f.readlines()
#     flag = 0
#     for j in line:
#         if "google" in j:# or "facebook" in j:
#             flag = 1
#             break
#     if flag == 1:
#         os.rename(dir+i,dir+"track/"+i)