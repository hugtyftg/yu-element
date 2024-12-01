import { describe, it, test, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import Button from './Button.vue';
import Icon from '../Icon/Icon.vue';

describe('Button.vue', () => {
  const onClick = vi.fn();
  test('basic button', async () => {
    const wrapper = mount(() => (
      <Button type="primary" {...{ onClick }}>
        basic button
      </Button>
    ));

    // class
    expect(wrapper.classes()).toContain('yu-button--primary');
    // slot
    expect(wrapper.get('button').text()).toBe('basic button');
    // events
    await wrapper.get('button').trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  test('disabled button', async () => {
    const wrapper = mount(() => <Button disabled>disabled button</Button>);

    // attrs
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').element.disabled).toBeTruthy();
    // events
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted('click')).toBeFalsy();
  });

  test('loading button', async () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
      slots: {
        default: 'loading button',
      },
      global: {
        stubs: ['YuIcon'],
      },
    });

    // class
    expect(wrapper.classes()).toContain('is-loading');

    // attrs
    expect(wrapper.attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').element.disabled).toBeTruthy();

    // events
    await wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
    expect(wrapper.emitted('click')).toBeFalsy();

    // icon
    const iconEle = wrapper.findComponent(Icon);
    expect(iconEle.exists()).toBeTruthy();
    expect(iconEle.attributes('icon')).toBe('spinner');
  });

  test('icon button', async () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'arrow-up',
      },
      slots: {
        default: 'icon button',
      },
      global: {
        stubs: ['YuIcon'],
      },
    });

    // icon
    const iconEle = wrapper.findComponent(Icon);
    expect(iconEle.exists()).toBeTruthy();
    expect(iconEle.attributes('icon')).toBe('arrow-up');
  });

  it('should call handleClick when useThrottle is true', async () => {
    const wrapper = mount(() => (
      <Button useThrottle={true}>throttled button</Button>
    ));

    // throttle
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');
    await wrapper.find('button').trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('should call handleClick when useThrottle is false', async () => {
    const wrapper = mount(() => (
      <Button useThrottle={false}>non-throttled button</Button>
    ));

    // non-throttle
    await wrapper.find('button').trigger('click');
    expect(onClick).toHaveBeenCalledOnce();
  });

  // Props: type
  it('should has the correct type class when type prop is set', () => {
    const types = ['primary', 'success', 'warning', 'danger', 'info'];
    types.forEach((type) => {
      const wrapper = mount(Button, {
        props: { type: type as any },
      });
      expect(wrapper.classes()).toContain(`yu-button--${type}`);
    });
  });

  // Props: size
  it('should has the correct size class when size prop is set', () => {
    const sizes = ['large', 'default', 'small'];
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size: size as any },
      });
      expect(wrapper.classes()).toContain(`yu-button--${size}`);
    });
  });

  // Props: plain, round, circle
  it.each([
    ['plain', 'is-plain'],
    ['round', 'is-round'],
    ['circle', 'is-circle'],
    ['disabled', 'is-disabled'],
    ['loading', 'is-loading'],
  ])(
    'should has the correct class when prop %s is set to true',
    (prop, className) => {
      const wrapper = mount(Button, {
        props: { [prop]: true },
        global: {
          stubs: ['ErIcon'],
        },
      });
      expect(wrapper.classes()).toContain(className);
    }
  );

  it('should has the correct native type attribute when native-type prop is set', () => {
    const wrapper = mount(Button, {
      props: { nativeType: 'submit' },
    });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect((wrapper.element as any).type).toBe('submit');
  });

  // Props: tag
  it('should renders the custom tag when tag prop is set', () => {
    const wrapper = mount(Button, {
      props: { tag: 'a' },
    });
    expect(wrapper.element.tagName.toLowerCase()).toBe('a');
  });

  // Events: click
  it('should emits a click event when the button is clicked', async () => {
    const wrapper = mount(Button, {});
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toHaveLength(1);
  });

  // Exception Handling: loading state
  it('should display loading icon and not emit click event when button is loading', async () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      global: {
        stubs: ['YuIcon'],
      },
    });
    const iconEle = wrapper.findComponent(Icon);

    // 按钮有.loading-icon类名
    expect(wrapper.find('.loading-icon').exists()).toBe(true);
    // icon图标元素存在
    expect(iconEle.exists()).toBeTruthy();
    // icon图标的icon属性值为spinner
    expect(iconEle.attributes('icon')).toBe('spinner');
    // 点击按钮，没有emit click
    await wrapper.trigger('click');
    expect(wrapper.emitted('click')).toBeUndefined();
  });
});
