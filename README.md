<h1>Image Upload Service (AWS Lambda + S3 + DynamoDB)</h1>

<p>
This project provides a simple system for uploading images to an Amazon S3 bucket and saving metadata to DynamoDB.  
All logic runs through a Lambda function deployed using AWS SAM.  
</p>

<h2>Features</h2>

<h3>1. Upload Image</h3>
<p>Path: <code>/upload</code></p>
<p>Method: POST</p>
<p>image should be in bas64 encoded format only</p>
<pre>
{
  "id": "123",
  "fileName": "sample.png",
  "image": "base64-encoded-string"
}
</pre>

<h3>2. Fetch Images</h3>
<p>Path: <code>/getImage?userid=1</code></p>
<p>Method: GET</p>

<h3>3. Delete Image</h3>
<p>Path: <code>/delete?userid=1&uuid=xyz</code></p>
<p>Method: DELETE</p>

<h2>Prerequisite</h2>
<ul>
  <li>AWS SAM CLI</li>
  <li>AWS CLI</li>
  <li>Docker</li>
</ul>

<h2>Run using sam cli</h2>

<pre>sam build</pre>
<p>it will compile your code and put in .aws folder which gets created after this command and make your deployable file ready to put on lamda</p>
<pre>sam deploy --guided</pre>
<p>this will create all the necessary resources needed for this project on aws cloud using template.yml</p>
<p>it will ask few prompts like app name and all... skip or do yes to proceed. after successful creation of all the resources in terminal output you will be seeing functional url lamda use that url and append the above paths to get started.</p>

<pre>sam deploy</pre>
<p>this command is for any changes in the template.yml that has to be deployed.</p>

<h2>Docker for local testing</h2>
<p>to test this lamda function in local you need to have docker running... and then using following command you can test locally.</p>
<pre>sam local invoke --yourlamdfunction -e events.json</pre>
<p>events.json is basically to mock the data as it will be on live environment.</p>

<h2>Monitoring</h2>
<p>Check CloudWatch Logs for Lambda logs.</p>

<h2>Notes</h2>
<p>Configure AWS credentials using:</p>
<pre>aws configure</pre>
