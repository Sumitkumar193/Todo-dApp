import Web3 from 'web3';
import { TodoStatus } from '@prisma/client';
import { enumMap } from '../../interfaces/AppCommonInterface';
import TodoContract from '../build/contracts/TodoContract.json';

class BlockchainService {
  private static instance: Web3;

  private static contractAddress: string;

  private static async getContractAddress() {
    if (!BlockchainService.contractAddress) {
      const web3 = this.getInstance();
      const networkId = await web3.eth.net.getId();
      BlockchainService.contractAddress =
        // @ts-expect-error - Type 'bigint' cannot be used as an index type.
        TodoContract.networks[networkId].address;
    }
    return BlockchainService.contractAddress;
  }

  private static getInstance(): Web3 {
    if (!BlockchainService.instance) {
      BlockchainService.instance = new Web3(
        (process.env.BLOCKCHAIN_URL as string) ?? 'http://localhost:7545',
      );
      BlockchainService.instance.eth.handleRevert = true;
    }

    return BlockchainService.instance;
  }

  private static async getContract() {
    const web3 = this.getInstance();
    const cAddress = await this.getContractAddress();
    const contract = new web3.eth.Contract(TodoContract.abi, cAddress);

    return contract;
  }

  private static async getAccounts() {
    const web3 = this.getInstance();
    const call = await web3.eth.getAccounts();
    return call;
  }

  static async getStatus(id: string): Promise<TodoStatus> {
    const contract = await this.getContract();
    const call: bigint = await contract.methods.getStatus(id).call();
    const int = parseInt(call.toString(), 10);
    const status = Object.keys(enumMap).find((key, index) => index === int);
    if (!status) {
      throw new Error('Invalid status');
    }
    return status as TodoStatus;
  }

  static async createTask(task: string) {
    const accounts = await this.getAccounts();
    const contract = await this.getContract();
    const call = await contract.methods
      .createTodo(task)
      .send({ from: accounts[0], gas: '3000000' });
    return call;
  }

  static async updateTask(id: string, status: TodoStatus) {
    const accounts = await this.getAccounts();
    const contract = await this.getContract();
    const statusValue = enumMap[status];
    const call = await contract.methods
      .updateTodoStatus(id, statusValue)
      .send({ from: accounts[0], gas: '3000000' });
    return call;
  }
}

export default BlockchainService;
