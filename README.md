This project is created to simulate the functionality of uploading image to s3 bucket and saving its relevant data to dynamodb using aws lamda


the lambda function url will be genrated after the cloudformation script runs. i.e the template.yaml gives the output of the created Function Url.

Then following operations can be performed.

path: /upload                               - to upload image to s3 
body: {id, fileName, image}  - image is encoded bas64 format


path: /getImage?userid=1         - to fetch all the images for userid 1;
queryparam = userid


path: /delete?userid=1&uuid=hbdhdhbhdsb
queryparam = userid,uuid          - uuid is the unique image id to identify and delete form s3 bucket