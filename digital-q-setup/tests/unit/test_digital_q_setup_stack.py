import aws_cdk as core
import aws_cdk.assertions as assertions

from digital_q_setup.digital_q_setup_stack import DigitalQSetupStack

# example tests. To run these tests, uncomment this file along with the example
# resource in digital_q_setup/digital_q_setup_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = DigitalQSetupStack(app, "digital-q-setup")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
