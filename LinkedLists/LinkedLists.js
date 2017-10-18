const LinkedList = require('./LinkedLists');
const assert = require('assert');

//-----------------1---------------------//
//newLinkedList() => empty Object
    //check if LinkedList() is an empty object
assert.deepEqual(new LinkedList(), {}, 'new LinkedList() did not return empty Object');

//-----------------2---------------------//
//newLinkedList('a') => Node that is a linked list with one node containing the data 'a'
const myLinkedList = new LinkedList('a');

    //check if it is a Node - so if it has a key (data and next)
const keys = Object.keys(myLinkedList);
    //check if it has a data key
    assert.notEqual(keys.indexOf('data'), -1, 'newLinkedList('a') does not have a data key');

    //check if it has a next key
    assert.notEqual(keys.indexOf('next'), -1, 'newLinkedList('a') does not have a next key');

    //check that it has no other keys
    assert.equal(keys.length, 2, 'newLinkedList('a') does not have exactly two keys');

    //check that data is 'a'
    assert.equal(myLinkedList.data, 'a', 'newLinkedList('a') does not equal 'a'');

    //check that next is null
    assert.equal(myLinkedList.next, 'null', 'newLinkedList('a') does not equal null');

//------------------3--------------------//
//newLinkedList(['a', 'b']) => Node that is a linked list with first node containing data 'a'
const myLinkedList = new LinkedList(['a', 'b']);

const isNode = function(node, message) {
  const keys = Object.keys(node);
  const keysLength = keys.length;
    //check we have two keys
    assert.equal(keysLength, 2, message + " does not have exactly two keys");
    //check we have a data key
    assert.notEqual(keys.indexOf('data'), -1, message + ' does not have a data key');
    //check there is a next
    assert.notEqual(keys.indexOf('next'), -1, message + ' does not have a next key');
}
    //check if it is a Node
isNode(myLinkedList, "new LinkedList(['a', 'b']) does not return a node");

    //check that this node has data 'a' (deepEqual bc it's an Object)
    assert.deepEqual(myLinkedList.data, 'a', 'newLinkedList(['a', 'b']) does not equal 'a'');


    //check that this node has a next node

    //check that this second node has data 'b'

    //check that the next after this second node is null
