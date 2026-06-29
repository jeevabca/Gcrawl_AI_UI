import { useState } from 'react';
import { Button, Input, Form, message } from 'antd';
import Cookies from 'js-cookie';
import useAxios from '../../../../services';

interface ReportIssueProps {
  submittedUrl: string;
}

export default function ReportIssue({ submittedUrl }: ReportIssueProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const email = Cookies.get("user_email") || "";
  const [form] = Form.useForm();

  const [request, , loading] = useAxios<any, any>({
    endpoint: "REPORT_ISSUE",
  });

  const onFinish = async (values: any) => {
    const payload = {
      url_affected: submittedUrl,
      email: email,
      issue_related_to: values.issue_related_to ? [values.issue_related_to] : [],
      explanation: values.explanation,
    };

    const res = await request({ data: payload });
    if (res && res.status !== "error" && res.status !== "failed") {
      message.success("Issue reported successfully!");
      setIsExpanded(false);
      form.resetFields();
    } else {
      message.error(res?.message || "Failed to report issue.");
    }
  };

  if (!isExpanded) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '10px' }}>
        <Button type="default" danger onClick={() => setIsExpanded(true)}>
          Report Issue
        </Button>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #f0f0f0',
      marginBottom: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>Report an Issue</h3>
        <Button type="text" onClick={() => setIsExpanded(false)}>Cancel</Button>
      </div>

      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item
          label="Issue Related To"
          name="issue_related_to"
          rules={[{ required: true, message: 'Please specify what the issue is related to.' }]}
        >
          <Input placeholder="e.g. Scrape accuracy, Timeout, Formatting" />
        </Form.Item>

        <Form.Item
          label="Explanation"
          name="explanation"
          rules={[{ required: true, message: 'Please provide an explanation.' }]}
        >
          <Input.TextArea rows={4} placeholder="Describe the issue you encountered..." />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button type="primary" htmlType="submit" loading={loading} danger>
            Submit Report
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
