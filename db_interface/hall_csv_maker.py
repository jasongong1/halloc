import math

for cluster in [403, 404, 405, 407, 408, 409, 411, 412, 413, 415, 416, 417, 419, 420, 422, 424]:
    level = 0
    if cluster in [403, 404]:
        level = 1
    elif cluster == 422:
        level = 6
    elif cluster == 424:
        level = 7
    else:
        level = math.floor((cluster - 405)/4) + 2
    print(f"{cluster},{level},1")
    for i in range(1, 6):
        print(f"{cluster}.{i},{level},1")
    if cluster != 404 and (level >= 6 or (cluster - 408) % 4 == 0):
        print(f"{cluster}.6,{level},1")