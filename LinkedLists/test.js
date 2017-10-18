const Node = function(arg) {
  return {
    data: arg,
    next: null
  };
}

const LinkedList = function(...args) {
  //create the nodes
  if(args.length < 1) {
    return {};
  }
  const nodeArray = args.map(arg => new Node(arg));
  //execute the nodes
  nodeArray.forEach((node, i) => {
    node.next = nodeArray[i + 1]
  })
  nodeArray[nodeArray.length - 1].next = null;
  return nodeArray ? nodeArray[0] : {};
}

module.exports = LinkedList;
