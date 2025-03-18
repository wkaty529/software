import React, { useState } from 'react';
import { Checkbox, Radio, Card, Divider, Space, Tag, Typography, Select, Row, Col } from 'antd';

const { Title, Text } = Typography;

const Choice_preference = () => {
  // 技能分类数据
  const skillCategories = {
    housework: {
      name: '家务技能',
      skills: [
        { id: 'cleaning', label: '清洁技巧', description: '包括基础清洁方法和工具使用' },
        { id: 'cooking', label: '烹饪技能', description: '能够准备日常餐食' },
        { id: 'laundry', label: '洗衣技能', description: '了解不同衣物的洗涤方法' },
        { id: 'organizing', label: '整理收纳', description: '空间整理与物品分类能力' }
      ]
    },
    maintenance: {
      name: '维修技能',
      skills: [
        { id: 'electrical', label: '电工知识', description: '基础电器维修和安全知识' },
        { id: 'plumbing', label: '水管维修', description: '基础管道问题处理能力' },
        { id: 'furniture', label: '家具维护', description: '家具组装和基础维修' }
      ]
    },
    childcare: {
      name: '育儿技能',
      skills: [
        { id: 'babycare', label: '婴幼儿照料', description: '基础育儿知识和技能' },
        { id: 'education', label: '教育辅导', description: '作业辅导和知识传授能力' },
        { id: 'entertainment', label: '儿童娱乐', description: '组织儿童活动的能力' }
      ]
    }
  };

  // 任务偏好数据
  const taskPreferences = {
    dailyTasks: {
      name: '日常任务',
      tasks: [
        { id: 'vacuum', label: '吸尘器清洁', timeFlexible: true },
        { id: 'dishes', label: '洗碗', timeFlexible: true },
        { id: 'garbage', label: '倒垃圾', timeFlexible: true },
        { id: 'bedmaking', label: '整理床铺', timeFlexible: true }
      ]
    },
    weeklyTasks: {
      name: '周期性任务',
      tasks: [
        { id: 'windowCleaning', label: '擦窗户', timeFlexible: true },
        { id: 'groceryShopping', label: '采购日用品', timeFlexible: true },
        { id: 'laundry', label: '洗衣服', timeFlexible: true }
      ]
    },
    specialTasks: {
      name: '特殊任务',
      tasks: [
        { id: 'repairs', label: '家电维修', timeFlexible: false },
        { id: 'gardening', label: '园艺护理', timeFlexible: true },
        { id: 'renovation', label: '家居改造', timeFlexible: false }
      ]
    }
  };

  // 时间偏好选项
  const timePreferences = [
    { value: 'morning', label: '早晨 (6:00-12:00)' },
    { value: 'afternoon', label: '下午 (12:00-18:00)' },
    { value: 'evening', label: '晚上 (18:00-22:00)' }
  ];

  // 状态管理
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [taskPrefs, setTaskPrefs] = useState({});
  const [preferredTime, setPreferredTime] = useState([]);

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>家庭成员技能与偏好设置</Title>
      
      {/* 技能选择部分 */}
      <Card title="技能标签选择" style={{ marginBottom: '20px' }}>
        {Object.entries(skillCategories).map(([key, category]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <Title level={4}>{category.name}</Title>
            <Space wrap>
              {category.skills.map(skill => (
                <Tag.CheckableTag
                  key={skill.id}
                  checked={selectedSkills.includes(skill.id)}
                  onChange={checked => {
                    const newSelected = checked
                      ? [...selectedSkills, skill.id]
                      : selectedSkills.filter(id => id !== skill.id);
                    setSelectedSkills(newSelected);
                  }}
                  style={{ padding: '5px 10px', marginBottom: '8px' }}
                >
                  {skill.label}
                </Tag.CheckableTag>
              ))}
            </Space>
          </div>
        ))}
      </Card>

      {/* 任务偏好部分 */}
      <Card title="任务偏好设置" style={{ marginBottom: '20px' }}>
        {Object.entries(taskPreferences).map(([key, category]) => (
          <div key={key} style={{ marginBottom: '20px' }}>
            <Title level={4}>{category.name}</Title>
            <Row gutter={[16, 16]}>
              {category.tasks.map(task => (
                <Col span={8} key={task.id}>
                  <Card size="small">
                    <Text>{task.label}</Text>
                    <Radio.Group
                      onChange={e => setTaskPrefs({
                        ...taskPrefs,
                        [task.id]: e.target.value
                      })}
                      value={taskPrefs[task.id]}
                    >
                      <Space direction="vertical">
                        <Radio value="like">喜欢</Radio>
                        <Radio value="neutral">中立</Radio>
                        <Radio value="dislike">不喜欢</Radio>
                      </Space>
                    </Radio.Group>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ))}
      </Card>

      {/* 时间偏好部分 */}
      <Card title="时间偏好设置">
        <Select
          mode="multiple"
          style={{ width: '100%' }}
          placeholder="选择偏好的任务时间段"
          onChange={setPreferredTime}
          options={timePreferences}
        />
      </Card>
    </div>
  );
};

export default Choice_preference; 