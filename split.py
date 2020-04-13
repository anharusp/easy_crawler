import os
import random
import shutil

BOUNCE = 0.7
TRAIN = '/train'
TEST = '/test'
ABSPATH = os.path.abspath('.')

random.seed(107)
for path, folder, files in os.walk('.'):
    if ('node_modules' not in path and '.git' not in path and "Default" not in path and "train" not in path and "test" not in path and len(path) > 1):
        num_files = len([f for f in os.listdir(path)
                   if os.path.isfile(os.path.join(path, f))])
        print(path, num_files)
        #print(files)
        random.shuffle(files)
        #print(files)
        
        if os.path.exists(path+TRAIN):
            shutil.rmtree(path+TRAIN)
        if os.path.exists(path+TEST):
            shutil.rmtree(path+TEST)

        
        os.makedirs(path+TRAIN, exist_ok=True)
        os.makedirs(path+TEST, exist_ok=True)

        num_train = int(num_files * BOUNCE)
        for (i, name) in enumerate(files):
            if i <= num_train:
                print(ABSPATH+path[1:]+'/train/{}.txt'.format(i))
                shutil.copyfile(path+'/'+name, ABSPATH+path[1:]+'/train/{}.txt'.format(i))
                #pass
            else:
                shutil.copyfile(path+'/'+name, ABSPATH+path[1:]+'/test/{}.txt'.format(i))
                #pass

path = 'graphql_coursera'
num_files = len([f for f in os.listdir(path)
                   if os.path.isfile(os.path.join(path, f))])
print(num_files)