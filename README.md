
This is an api gateway endpoint that routes all requests to a lambda that echoes the path after the base url. The lambda is invoked by another lambda that counts the hits to each url path, and relays its response as the gateway response. This hitCounter lambda is made with a custom cdk construct.

Visits to paths of this endpoint: https://hww03smvy3.execute-api.us-east-1.amazonaws.com/prod/crossing/paths will be counted with path as key. 

Data can be seen in this database viewer: https://d8eu8nrv1l.execute-api.us-east-1.amazonaws.com/prod/


## Tutorial  
See [this useful workshop](https://cdkworkshop.com/20-typescript.html) 