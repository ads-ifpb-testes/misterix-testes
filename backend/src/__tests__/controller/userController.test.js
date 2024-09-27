import httpMocks from 'node-mocks-http';
import { logIn } from '../../controller/userController.js';
import User from '../../model/mongooseUser';
import { generateAccessToken } from '../../service/jwtService';
jest.mock('../../service/jwtService.js', () => {
    return {
        generateAccessToken: jest.fn(() => '123')
    }
})
const userFindOneMock = jest.spyOn(User, 'findOne');
const userCreateMock = jest.spyOn(User, 'create');

const user = {login: 'test', password: 'test'};
const req = httpMocks.createRequest();

beforeEach(() => {
    userFindOneMock.mockImplementation(jest.fn());
    userCreateMock.mockImplementation(jest.fn());
});

test('Cadastrar usuário', async () => {
    const res = httpMocks.createResponse({
        locals: {user}
    });

    await logIn(req, res);

    expect(userFindOneMock).toHaveBeenCalledWith({login: user.login});
    expect(userCreateMock).toHaveBeenCalledWith(user);
    expect(generateAccessToken).toHaveBeenCalledWith(user.login);
    expect(res.statusCode).toBe(201);
    expect(res._getJSONData()).toBe('123');
});

test('Logar usuário', async () => {
    userFindOneMock.mockImplementation(() => user);
    const res = httpMocks.createResponse({
        locals: {user}
    });

    await logIn(req, res);

    expect(userFindOneMock).toHaveBeenCalledWith({login: user.login});
    expect(userCreateMock).not.toHaveBeenCalled();
    expect(generateAccessToken).toHaveBeenCalledWith(user.login);
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toBe('123');
});

test('Logar usuário com senha errada', async () => {
    userFindOneMock.mockImplementation(() => user);
    const res = httpMocks.createResponse({
        locals: {user: {login: user.login, password: '1234'}}
    });

    await logIn(req, res);

    expect(userFindOneMock).toHaveBeenCalledWith({login: user.login});
    expect(userCreateMock).not.toHaveBeenCalled();
    expect(generateAccessToken).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(403);
});
