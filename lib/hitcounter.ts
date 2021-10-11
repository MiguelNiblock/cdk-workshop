import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export interface HitCounteProps {
  downstream: lambda.IFunction,
  readCapacity?: number;
}

export class HitCounter extends cdk.Construct {

  public readonly handler: lambda.Function;
  public readonly table: dynamodb.Table;
  
  constructor (scope: cdk.Construct, id: string, props: HitCounteProps){
    super(scope, id)

    if (props.readCapacity !== undefined && (props.readCapacity < 5 || props.readCapacity > 20)) {
      throw new Error('readCapacity must be greater than 5 and less than 20');
    }

    this.table = new dynamodb.Table(this, 'Hits', {
      partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING },
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      readCapacity: props.readCapacity ?? 5
    });
    
    this.handler = new lambda.Function(this, 'HitCounterHandler', {
      runtime: lambda.Runtime.NODEJS_12_X,
      handler: 'hitcounter.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
        HITS_TABLE_NAME: this.table.tableName
      }
    })

    this.table.grantReadWriteData(this.handler)

    props.downstream.grantInvoke(this.handler);

  }
}