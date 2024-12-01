import type { Meta, StoryObj, ArgTypes } from '@storybook/vue3';
import { expect, fn, userEvent, within } from '@storybook/test';
import { YuButton } from 'yu-element';

// 沙盒容器
const container = (val: string) => `
  <div style="margin: 5px">
    ${val}
  </div>
`;
// 沙盒内容
const content = `<yu-button v-bind="args">{{args.content}}</yu-button>`;

type Story = StoryObj<typeof YuButton> & { argTypes: ArgTypes };

// 配置页信息
const meta: Meta<typeof YuButton> = {
  title: 'Example/Button',
  component: YuButton,
  tags: ['autodocs'],
  // 每个参数的设置方式和可取的值
  argTypes: {
    tag: {
      control: { type: 'select' },
      options: ['button', 'a', 'div'],
    },
    nativeType: {
      control: { type: 'select' },
      options: ['button', 'submit', 'reset'],
    },
    type: {
      control: { type: 'select' },
      options: [],
    },
    size: {
      control: { type: 'select' },
      options: [],
    },
    plain: {
      control: { type: 'boolean' },
    },
    round: {
      control: { type: 'boolean' },
    },
    circle: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    autofocus: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'text' },
    },
    loading: {
      control: { type: 'boolean' },
    },
    loadingIcon: {
      control: { type: 'text' },
    },
    useThrottle: {
      control: { type: 'boolean' },
    },
    throttleDuration: {
      control: { type: 'number' },
    },
  },
  args: { onClick: fn() },
};

// 页面初始展示默认配置
export const Default: Story & { args: { content: string } } = {
  argTypes: {
    content: {
      control: {
        type: 'text',
      },
    },
  },
  args: {
    type: 'primary',
    size: 'default',
    content: 'Button',
  },
  render: (args) => ({
    components: { YuButton },
    setup() {
      return { args };
    },
    template: container(content),
  }),
  // 默认页的测试用例
  play: async ({ canvasElement, args, step }) => {
    // 进入页面：将 canvasElement 包装为一个测试工具对象 canvas
    const canvas = within(canvasElement);
    // 测试步骤：单次点击页面中第一个button按钮
    await step('click button', async () => {
      await userEvent.click(canvas.getByRole('button'));
    });
    // 期望结果：验证 args 对象中的 onClick 方法是否被调用
    expect(args.onClick).toBeCalled();
  },
};
export default meta;
