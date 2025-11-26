This project is created to simulate the functionality of uploading image to s3 bucket and saving its relevant data to dynamodb using aws lamda


the lambda function url will be genrated after the cloudformation script runs. i.e the template.yaml gives the output of the created Function Url.

Then following operations can be performed.


path: /upload                               - to upload image to s3 
body: {id, fileName, image}  - image is encoded bas64 format


path: /getImage?userid=1         - to fetch all the images for userid 1;
queryparam = userid


path: /delete?userid=1&uuid=hbdhdhbhdsb

queryparam = userid,uuid          - uuid is the unique image id to identify and delete form s3 bucket


How to make this repo running....

1) install sam cli
2) install aws sdk - this is to configure your credentials
3) need Docker running to run and test on local env.

to deploy on aws using sam cli follow the following steps.
1) sam build // this will build a.k.a compile your ts code to js files and it will in .aws/build folder your bundled code.
1) sam deploy --guided // this will run your template.yaml basically the cloudformation script which will create resources like s3 and dynamodb on aws cloud. and it will                             also create iam role mentioned in the same file and give access to mentioned resources.
3) after successfull deployment you will be seeing the functional url in the terminal. and using that url you can append the above paths to carry out operation mentioned.
 above.
4) Error can be seen in cloudwatch logs on the lamda function montering tab.

5) sam deploy --guided is only run first time to create the resources next time after your code changes just do sam build and sam deploy.

Note: In case you are getting access issue then you can use your ~./aws credentials to establish a connection.
