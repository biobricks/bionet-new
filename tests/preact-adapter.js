import Preact from 'preact';
import PreactCompat from 'preact-compat';
import renderToString from 'preact-render-to-string';
import ShallowRenderer from 'react-test-renderer/shallow';
import TestUtils from 'preact-test-utils';
import values from 'object.values';
import { EnzymeAdapter } from 'enzyme';
import {
  elementToTree,
  mapNativeEventNames,
  propFromEvent,
  withSetStateAllowed,
  assertDomAvailable,
  createRenderWrapper,
  createMountWrapper,
  propsWithKeysAndRef,
  ensureKeyOrUndefined,
  isArrayLike,
  nodeTypeFromType,
  flatten
} from 'enzyme-adapter-utils';

const VNode = Preact.h('a', null).constructor;
const EmptyComponent = () => null;
const KEY = '__k'
const REF = '__r'
const TEXT_NODE = 3

const FunctionalComponent = 1;
const ClassComponent = 2;
const HostRoot = 3;
const HostPortal = 4;
const HostComponent = 5;
const HostText = 6;
const Fragment = 10;

function nodeToHostNode(_node) {
  // NOTE(lmr): node could be a function component
  // which wont have an instance prop, but we can get the
  // host node associated with its return value at that point.
  // Although this breaks down if the return value is an array,
  // as is possible with React 16.
  let node = _node;
  while (node && !Array.isArray(node) && node.instance === null) {
    node = node.rendered;
  }
  if (Array.isArray(node)) {
    // TODO(lmr): throw warning regarding not being able to get a host node here
    throw new Error('Trying to get host node of an array');
  }
  // if the SFC returned null effectively, there is no host node.
  if (!node) {
    return null;
  }
  return PreactCompat.findDOMNode(node.instance);
}

function instanceToTree(node) {
  if (node === null || typeof node !== 'object') {
    return node;
  }
  const instance = node._component;
  const hostNodeProps = node.__preactattr_;
  const className = (hostNodeProps) ? hostNodeProps.class : null
  const type = nodeTypeFromType(node.type)
  
  //console.log('type: %s name: %s class: %s',type, node.nodeName, className)
  
  const children = [].slice.call(node.childNodes);
  if (typeof classProp ==='string') {
      hostNodeProps.className = className
  }
  var rendered=null
  if (isArrayLike(children)) {
    rendered = flatten(children).map(instanceToTree);
  } else if (typeof children !== 'undefined') {
    rendered = instanceToTree(children);
  }
    var treeNode = null
    if (node.nodeName==='#text') {
        return node.nodeValue
    }
    if (instance) {
        const props = instance.props;
        treeNode = {
            nodeType: 'class',
            type: instance.constructor,
            key: instance[KEY],
            ref: instance[REF],
            props: {},
            instance: instance,
            rendered: {
                nodeType: type,
                type: node.nodeName.toLowerCase(),
                props: hostNodeProps,
                instance: node,
                rendered: rendered
            }
        }
    } else {
        treeNode = {
            nodeType: type,
            type: node.nodeName.toLowerCase(),
            props: hostNodeProps,
            ref: null,
            instance: node,
            rendered: rendered
        }
    }
    return treeNode
}

class PreactAdapter extends EnzymeAdapter {
  constructor() {
    super();
    this.options = {
      ...this.options,
      supportPrevContextArgumentOfComponentDidUpdate: true,
    };
  }
  createMountRenderer(options) {
    assertDomAvailable('mount');
    const domNode = options.attachTo || global.document.createElement('div');
    let instance = null;
    let wrappedEl = null;
    let PreactWrapperComponent = null;
    return {
      render(el, context, callback) {
        if (!instance) {
          const nodeName = el.type
          //console.log('render, el:',nodeName)
          PreactWrapperComponent = createMountWrapper(el, options);
          wrappedEl = Preact.h(PreactWrapperComponent, {
            Component: el.type,
            props: el.props,
            context,
          });
          instance = Preact.render(wrappedEl, domNode);
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          if (typeof callback === 'function') {
            callback();
          }
        }
      },
      unmount() {
        Preact.render(Preact.h(EmptyComponent), domNode, instance);
        instance = null;
      },
      getNode() {
        return instance ? instanceToTree(instance) : null;
      },
      simulateEvent(node, event, mock) {
        const mappedEvent = mapNativeEventNames(event);
        const eventFn = TestUtils.Simulate[mappedEvent];
        if (!eventFn) {
          throw new TypeError(`ReactWrapper::simulate() event '${event}' does not exist`);
        }
        eventFn(node.instance && node.instance.base || node.instance, mock);
      },
      batchedUpdates(fn) {
        return fn;
      }
    };
  }

  createShallowRenderer(/* options */) {
    const renderer = new ShallowRenderer();
    let isDOM = false;
    let cachedNode = null;
    return {
      render(el, context) {
        cachedNode = el;
        if (typeof el.nodeName === 'string') {
          isDOM = true;
        } else {
          isDOM = false;
          return withSetStateAllowed(() => renderer.render(el, context));
        }
      },
      unmount() {
        renderer.unmount();
      },
      getNode() {
        if (isDOM) {
          return elementToTree(cachedNode);
        }
        const output = renderer.getRenderOutput();
          //            rendered: elementToTree(output),

        return {
          nodeType: renderer._instance ? 'class' : 'function',
          type: cachedNode.nodeName,
          props: cachedNode.attributes,
          key: cachedNode[KEY] || undefined,
          ref: cachedNode[REF],
          instance: renderer._instance,
          rendered: Array.isArray(output)
            ? flatten(output).map(elementToTree)
            : elementToTree(output),
        };
      },
      simulateEvent(node, event, ...args) {
        const handler = node.props[propFromEvent(event)];
        if (handler) {
          withSetStateAllowed(() => handler(...args));
        }
      },
      batchedUpdates(fn) {
        return withSetStateAllowed(fn);
      }
    };
  }

  createStringRenderer(options) {
    return {
      render(el, context) {
        if (options.context && (el.nodeName.contextTypes || options.childContextTypes)) {
          const childContextTypes = {
            ...(el.nodeName.contextTypes || {}),
            ...options.childContextTypes,
          };
          const ContextWrapper = createRenderWrapper(el, context, childContextTypes);
          return renderToString(Preact.h(ContextWrapper));
        }
        return renderToString(el);
      },
    };
  }

  // Provided a bag of options, return an `EnzymeRenderer`. Some options can be implementation
  // specific, like `attach` etc. for React, but not part of this interface explicitly.
  // eslint-disable-next-line class-methods-use-this, no-unused-vars
  createRenderer(options) {
    switch (options.mode) {
      case EnzymeAdapter.MODES.MOUNT: return this.createMountRenderer(options);
      case EnzymeAdapter.MODES.SHALLOW: return this.createShallowRenderer(options);
      case EnzymeAdapter.MODES.STRING: return this.createStringRenderer(options);
      default:
        throw new Error(`Enzyme Internal Error: Unrecognized mode: ${options.mode}`);
    }
  }

  // converts an RSTNode to the corresponding JSX Pragma Element. This will be needed
  // in order to implement the `Wrapper.mount()` and `Wrapper.shallow()` methods, but should
  // be pretty straightforward for people to implement.
  nodeToElement(node) {
    if (!node || typeof node !== 'object') return null;
    return Preact.h(node.type, propsWithKeysAndRef(node));
  }

  elementToNode(element) {
    return elementToTree(element);
  }
      
  nodeToHostNode(node) {
    return nodeToHostNode(node);
  }

  isValidElement(element) {
    return element && (element instanceof VNode);
  }

  createElement(...args) {
    return Preact.h(...args);
  }
}

module.exports = PreactAdapter;