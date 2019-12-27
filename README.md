1. 类型还有 
   string, 
   [定长浮点型](https://solidity-cn.readthedocs.io/zh/develop/types.html#index-4)
   数组，
   枚举
2. 关于external, public, internal, private可以给一张这样的图https://www.itread01.com/content/1546054868.html


## 说明
ppt中的例子(1, 2, 3, ...)依次对应 <code>contracts</code>, <code>migrations</code>, <code>test</code>中的(2, 3, 4, ...)

<code>contracts</code>中的其他未标识数字的文件对应一本ERC20的依赖文件，其migration文件，对应其内序号<code>10_deploy_mytoken.js</code>, 其测试文件为<code>test</code>下的<code>mytoken1.js</code>与<code>mytoken2.js</code>.



[truffle 文档](https://learnblockchain.cn/docs/truffle/getting-started/interacting-with-your-contracts.html)

[web3.js api reference](https://web3.tryblockchain.org/Web3.js-api-refrence.html)


<code> truffle compile</code>

<code> truffle migrate</code>

<code> truffle test .\test\mytoken1.js</code>

The difference between <code>mytoken1.js</code> and <code>mytoken2.js</code> is almost nothing.

<code>mytoken1.js</code> is the official recommended style.

<code>mytoken2.js</code> is a better way to adjust if different test cases are independent.


## In truffle console / truffle development mode

#### Get contract instance in truffle console:
1. <code>let instance = await MetaCoin.deployed()</code>
2. Or suppose contract address ： <code>0x133739AB03b9be2b885cC11e3B9292FDFf45440E</code>, 
    we can use <code>let instance = await MyToken.at("0x133739AB03b9be2b885cC11e3B9292FDFf45440E")</code> to obtain the instance.

#### Call contract function (pre-invoke)
```
instance.name() / await instance.name()

isntance.symobl()

(await instance.totalSupply()).toNumber()

```

#### send Transaction: (invoke)
<code>let result = await instance.transfer(accounts[1], 100)</code>

the returned structure is the following:
```
result = {
    "tx": .., 
    "receipt": ..,
    "logs": []
}

```

<code> await instance.approve(accounts[2], 100)</code>

<code> (await instance.allowance(accounts[0], accounts[2])).toNumber()</code>

<code> let result1 = await instance.transferFrom(accounts[0], accounts[2], 1, {from:accounts[2]})
</code> ({from: ***} to indicate the msg.sender of this transaction)

#### about ether

Note: in truffle console, <code>accounts</code> by default means <code>eth.web3.accounts</code>

query balance : <code>web3.eth.getBalance(accounts[0])</code>

send ether: <code>web3.eth.sendTransaction({from: accounts[0], to: accounts[1], value: web3.utils.toWei('1', "ether")})</code>




From 7 on, we follow the test script styple giving [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts.git).

```
npm install --save-dev @openzeppelin/test-helpers

```

For 14 <code> npm install ethereumjs-abi --save</code>