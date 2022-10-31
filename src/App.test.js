import { render, screen } from '@testing-library/react';
import {parseArguments, createEventObject} from './utils/origin.utils';
import App from './App';

describe('Testing Components on Render', function() {
  test('renders loading overlay', () => {
    render(<App />);
    const loadingElement = screen.getByTestId('overlay');
    expect(loadingElement).toBeInTheDocument();
  });

  test('renders title', () => {
    render(<App />);
    const linkElement = screen.getByText(/OUSD Vault Event Logs/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders image', async () => {
    render(<App />)
    const image = screen.getByAltText('Origin Protocol');
    expect(image.src).toContain('/ousd-coin.svg');
  });

  test('renders data grid', () => {
    render(<App />);
    const dataGrid = screen.getByRole('grid');
    expect(dataGrid).toBeInTheDocument();
  });
});

describe('Testing ParseArguments', function() {
  test('parses 3 arguments and correctly assigns their value', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    const args = ['0x1234', '0x2345', '0x6789'];
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toEqual('0x1234');
    expect(object.secondArgument).toEqual('0x2345');
    expect(object.thirdArgument).toEqual('0x6789');
  });

  test('parses 2 arguments and correctly assigns their value', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    const args = ['0x1234', '0x2345'];
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toEqual('0x1234');
    expect(object.secondArgument).toEqual('0x2345');
    expect(object.thirdArgument).toBeUndefined();
  });

  test('parses 1 argument and correctly assigns its value', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    const args = ['0x1234'];
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toEqual('0x1234');
    expect(object.secondArgument).toBeUndefined();
    expect(object.thirdArgument).toBeUndefined();
  });

  test('parses 0 arguments and correctly assigns nothing', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    const args = [];
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toBeUndefined();
    expect(object.secondArgument).toBeUndefined();
    expect(object.thirdArgument).toBeUndefined();
  });

  test('parses more than 3 arguments and correctly assigns the first three', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    const args = ['0x1234', '0x2345', '0x6789', '0x1011'];
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toEqual('0x1234');
    expect(object.secondArgument).toEqual('0x2345');
    expect(object.thirdArgument).toEqual('0x6789');
    expect(object.fourthArgument).toBeUndefined();
  });

  test('does nothing if argument is not an array', () => {
    const createEventObjectMock = jest.fn();
    createEventObjectMock.mockReturnValueOnce({});

    let args = 0;
    let object = createEventObjectMock();

    parseArguments(object, args);

    expect(object.firstArgument).toBeUndefined();
    expect(object.secondArgument).toBeUndefined();
    expect(object.thirdArgument).toBeUndefined();

    args = "hello";

    parseArguments(object, args);

    expect(object.firstArgument).toBeUndefined();
    expect(object.secondArgument).toBeUndefined();
    expect(object.thirdArgument).toBeUndefined();
  });
});

describe('Testing createEventObject', function() {
  test('Creates an event object with all elements', () => {
    const fetchAndParseOriginLogsMock = jest.fn();

    fetchAndParseOriginLogsMock.mockReturnValueOnce({
      blockNumber: 0,
      blockHash: '0xabcd'
    });

    fetchAndParseOriginLogsMock.mockReturnValueOnce({
      name: 'Test',
      signature: 'Test(uint256 param)',
      topic: '0xdefg',
      args: ['0x1234', '0x2345', '0x6789']
    });

    fetchAndParseOriginLogsMock.mockReturnValueOnce(1);

    const myEventObject = createEventObject(fetchAndParseOriginLogsMock(), fetchAndParseOriginLogsMock(), fetchAndParseOriginLogsMock());

    expect(myEventObject.id).toEqual(1);
    expect(myEventObject.blockNumber).toEqual(0);
    expect(myEventObject.blockHash).toEqual('0xabcd');
    expect(myEventObject.name).toEqual('Test');
    expect(myEventObject.signature).toEqual('Test(uint256 param)');
    expect(myEventObject.topic).toEqual('0xdefg');
    expect(myEventObject.firstArgument).toEqual('0x1234');
    expect(myEventObject.secondArgument).toEqual('0x2345');
    expect(myEventObject.thirdArgument).toEqual('0x6789');
  });

  test('Creates an event object with missing elements', () => {
    const fetchAndParseOriginLogsMock = jest.fn();

    fetchAndParseOriginLogsMock.mockReturnValueOnce({
      blockNumber: 0,
    });

    fetchAndParseOriginLogsMock.mockReturnValueOnce({
      name: 'Test',
      args: ['0x1234', '0x2345']
    });

    const myEventObject = createEventObject(fetchAndParseOriginLogsMock(), fetchAndParseOriginLogsMock());

    expect(myEventObject.id).toBeUndefined();
    expect(myEventObject.blockNumber).toEqual(0);
    expect(myEventObject.blockHash).toBeUndefined();
    expect(myEventObject.name).toEqual('Test');
    expect(myEventObject.signature).toBeUndefined();
    expect(myEventObject.topic).toBeUndefined();
    expect(myEventObject.firstArgument).toEqual('0x1234');
    expect(myEventObject.secondArgument).toEqual('0x2345');
    expect(myEventObject.thirdArgument).toBeUndefined();
  });

  test('Creates an event object with no elements', () => {
    const fetchAndParseOriginLogsMock = jest.fn();

    fetchAndParseOriginLogsMock.mockReturnValueOnce({});

    fetchAndParseOriginLogsMock.mockReturnValueOnce({});

    const myEventObject = createEventObject(fetchAndParseOriginLogsMock(), fetchAndParseOriginLogsMock());

    expect(myEventObject.id).toBeUndefined();
    expect(myEventObject.blockNumber).toBeUndefined();
    expect(myEventObject.blockHash).toBeUndefined();
    expect(myEventObject.name).toBeUndefined();
    expect(myEventObject.signature).toBeUndefined();
    expect(myEventObject.topic).toBeUndefined();
    expect(myEventObject.firstArgument).toBeUndefined();
    expect(myEventObject.secondArgument).toBeUndefined();
    expect(myEventObject.thirdArgument).toBeUndefined();
  });
});

