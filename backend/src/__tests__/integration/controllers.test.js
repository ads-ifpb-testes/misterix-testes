import httpMocks from 'node-mocks-http';
import {logIn} from '../../controller/userController.js';
import mongoose from '../../data/mongoose.js';
import User from '../../model/mongooseUser.js';
import Legend from '../../model/mongooseLegend.js';
import redisClient from '../../data/redis.js';
import { getLegends, getMyLegends, postLegend, searchLegends } from '../../controller/legendController.js';
jest.mock('../../data/redis.js');

const redisGetMock = jest.spyOn(redisClient, 'get');
const redisSetMock = jest.spyOn(redisClient, 'set');
const redisDelMock = jest.spyOn(redisClient, 'del');

beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(globalThis.__MONGO_URI__ + globalThis.__MONGO_DB_NAME__);
    await User.deleteMany({});
    await Legend.deleteMany({});

    redisGetMock.mockImplementation(() => undefined);
    redisSetMock.mockImplementation(jest.fn());
    redisDelMock.mockImplementation(jest.fn());

    await User.create({login: 'user1', password: '123456'});
    await Legend.create({
        title: 'bicho papão', 
        description: 'bicho papão', 
        type: 'monstro', 
        location: {
            type: 'Point',
            coordinates: [1, 1]
        },
        postedBy: 'user1'
    });
});

afterAll(async () => {
    await User.deleteMany({});
    await Legend.deleteMany({});
    await mongoose.disconnect();

    jest.clearAllMocks();
});

test('Cadastrar usuário', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {user: {login: 'user', password: '123456'}}
    });

    await logIn(req, res);
    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
});

test('Logar usuário', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {user: {login: 'user', password: '123456'}}
    });

    await logIn(req, res);
    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(200);
});

test('Adicionando Lenda', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {
            login: 'user',
            legend: {
                title: 'loira do banheiro', 
                description: 'loira do banheiro', 
                type: 'espírito', 
                location: {
                    type: 'Point',
                    coordinates: [1, 1]
                }
            }
        }
    });

    await postLegend(req, res);
    const count = await Legend.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
});

test('Buscar lendas', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse();

    await getLegends(req, res);

    expect(res.statusCode).toBe(200);
    expect(res._getJSONData().length).toBe(2);
})

test('Buscar minhas lendas', async () => {
    const req = httpMocks.createRequest();
    const res = httpMocks.createResponse({
        locals: {login: 'user'}
    });

    await getMyLegends(req, res);
    const legends = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].postedBy).toBe('user');
})

test('Procurar lendas', async () => {
    const req = httpMocks.createRequest({
        query: {query: 'monstro'}
    });
    const res = httpMocks.createResponse();

    await searchLegends(req, res);
    const legends = res._getJSONData();

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].type).toBe('monstro');
})