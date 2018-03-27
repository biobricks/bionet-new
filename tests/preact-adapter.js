import Preact from 'preact';
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
  ensureKeyOrUndefined
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

function nodeAndSiblingsArray(nodeWithSibling) {
  const array = [];
  let node = nodeWithSibling;
  while (node != null) {
    array.push(node);
    node = node.sibling;
  }
  return array;
}

function flatten(arr) {
  const result = [];
  const stack = [{ i: 0, array: arr }];
  while (stack.length) {
    const n = stack.pop();
    while (n.i < n.array.length) {
      const el = n.array[n.i];
      n.i += 1;
      if (Array.isArray(el)) {
        stack.push(n);
        stack.push({ i: 0, array: el });
        break;
      }
      result.push(el);
    }
  }
  return result;
}

function toTree(vnode) {
  if (!vnode) {
    return null;
  }
  //const node = findCurrentFiberUsingSlowPath(vnode);
    //const node = vnode._component
    //console.log('***node:',node.toString())
    const node=vnode
    console.log('***node.type:',node.nodeType,node.nodeName.toLowerCase())
    switch (1) {
    //switch (node.nodeType) {
    case HostRoot: // 3
      return toTree(node.child);
    case HostPortal: // 4
      return toTree(node.child);
    case ClassComponent:
      return {
        nodeType: 'class',
        type: node.type,
        props: { ...node.memoizedProps },
        key: ensureKeyOrUndefined(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: childrenToTree(node.child),
      };
    case Fragment: // 10
      return childrenToTree(node.child);
    case FunctionalComponent: // 1
      const instance = node._component;
      let renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(toTree));
      const children = [].slice.call(node.childNodes);
      if (renderedNodes.length === 0) {
        renderedNodes = children.map(toTree);
      }
      if (instance) {
        return {
            nodeType: 'function',
            type: node.nodeName.toLowerCase(),
            props: node.__preactattr_,
            key: instance[KEY],
            ref: instance[REF],
            instance: node,
            rendered: renderedNodes,
        }
      }
      /*
      if (node.nodeType === TEXT_NODE) {
        return node.nodeValue
      }
      return {
        nodeType: 'host',
        type: node.nodeName.toLowerCase(),
        props: node.__preactattr_,
        instance: node,
        rendered: renderedNodes,
      }
      */
      /*
      return {
        nodeType: 'function',
        type: node.type,
        props: { ...node.memoizedProps },
        key: ensureKeyOrUndefined(node.key),
        ref: node.ref,
        instance: null,
        rendered: childrenToTree(node.child),
      };
      */
    case HostComponent: { // 5
      let renderedNodes = flatten(nodeAndSiblingsArray(node.child).map(toTree));
      const children = [].slice.call(node.childNodes);
      if (renderedNodes.length === 0) {
        renderedNodes = children.map(toTree);
      }
        /*
        renderedNodes = [node.memoizedProps.children];
      nodeType: 'class',
      type: instance.constructor,
      props: props,
      key: instance[KEY],
      ref: instance[REF],
      instance: instance,
      rendered: {
        nodeType: 'host',
        type: node.nodeName.toLowerCase(),
        props: hostNodeProps,
        instance: node,
        children: children.map(instanceToTree)
      }
      return {
        nodeType: 'host',
        type: node.type,
        props: { ...node.memoizedProps },
        key: ensureKeyOrUndefined(node.key),
        ref: node.ref,
        instance: node.stateNode,
        rendered: renderedNodes,
      };
        */
      const instance = node._component;
      if (instance) {
        return {
            nodeType: 'host',
            type: instance.constructor,
            props: instance.props,
            key: instance[KEY],
            ref: instance[REF],
            instance: node.stateNode,
            rendered: renderedNodes,
        }
      }
      if (node.nodeType === TEXT_NODE) {
        return node.nodeValue
      }
      return {
        nodeType: 'host',
        type: node.nodeName.toLowerCase(),
        props: node.__preactattr_,
        instance: node,
        rendered: children.map(instanceToTree),
      }
        
    }
    case HostText: // 6
      return node.__preactattr_;
    default:
      throw new Error(`Enzyme Internal Error: unknown node with tag ${node.tag}`);
  }
}
function childrenToTree(node) {
  if (!node) {
    return null;
  }
  const children = nodeAndSiblingsArray(node);
  if (children.length === 0) {
    return null;
  } else if (children.length === 1) {
    return toTree(children[0]);
  }
  return flatten(children.map(toTree));
}

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
  return ReactDOM.findDOMNode(node.instance);
}
function instanceToTree(node) {
  if (!node) {
    return null
  }
  const instance = node._component;
  const hostNodeProps = node.__preactattr_;
  const children = [].slice.call(node.childNodes);
  // If _component exists this node is the root of a composite
        //children: children.map(instanceToTree)
/*
    return {
      nodeType: 'class',
      type: instance.constructor,
      props: props,
      key: instance[KEY],
      ref: instance[REF],
      instance: instance,
      rendered: {
        nodeType: 'host',
        type: node.nodeName.toLowerCase(),
        props: hostNodeProps,
        instance: node,
        children: flatten(children.map(toTree))
      }
    }
*/
  if (instance) {
    const props = instance.props;
    return {
      nodeType: 'host',
      type: node.nodeName.toLowerCase(),
      props: hostNodeProps,
      key: instance[KEY],
      ref: instance[REF],
      instance: node,
      rendered: flatten(children.map(toTree))
    }
  }

  if (node.nodeType === TEXT_NODE) {
    return node.nodeValue
  }

  return {
    nodeType: 'host',
    type: node.nodeName.toLowerCase(),
    props: hostNodeProps,
    instance: node,
    rendered: children.map(instanceToTree),
  }
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
    return {
      render(el, context, callback) {
        if (instance === null) {
          const PreactWrapperComponent = createMountWrapper(el, options);
          const wrappedEl = Preact.h(PreactWrapperComponent, {
            Component: el.type,
            props: el.props,
            context,
          });
          instance = Preact.render(wrappedEl, domNode);
          if (typeof callback === 'function') {
            callback();
          }
        } else {
          //instance.setChildProps(el.props, context, callback);
            //todo: setprops is async on preact but sync on react
          instance.setProps(el.props, context, callback);
        }
      },
      unmount() {
        Preact.render(Preact.h(EmptyComponent), domNode, instance);
        instance = null;
      },
      getNode() {
        //console.log('getNode:',instance.nodeName)
        //return instance ? toTree(instance).rendered : null;
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
      /*
  nodeToHostNode(node) {
    return node.instance && node.instance.base || node.instance;
  }
  */

  isValidElement(element) {
    return element && (element instanceof VNode);
  }

  createElement(...args) {
    return Preact.h(...args);
  }
}

module.exports = PreactAdapter;