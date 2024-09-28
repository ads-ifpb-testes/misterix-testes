import httpMocks from 'node-mocks-http';
import {logIn} from '../../controller/userController.js';
import User from '../../model/mongooseUser.js';
import Legend from '../../model/mongooseLegend.js';
import request from 'supertest';
import app from '../../index.js';
import { getLegends, getMyLegends, postLegend, searchLegends } from '../../controller/legendController.js';
import mongoose from '../../data/mongoose.js';
import { generateAccessToken } from '../../service/jwtService.js';
jest.mock('../../data/redis.js', () => {
    return {
        del: jest.fn(),
        set: jest.fn(),
        get: () => undefined,
    }
});

beforeAll(async () => {
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
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    jest.clearAllMocks();
});

const token = generateAccessToken('user');

test('Cadastrar usuário', async () => {
    const res = await request(app)
        .post('/users/login')
        .set("content-type", "application/json")
        .send({login: 'user', password: '123456'})

    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
    expect(res.body).toBeDefined();
});

test('Logar usuário', async () => {
    const res = await request(app)
        .post('/users/login')
        .set("content-type", "application/json")
        .send({login: 'user', password: '123456'});

    const count = await User.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
});

test('Adicionando Lenda', async () => {
    const res = await request(app)
        .post('/legends')
        .set("content-type", "application/json")
        .set('Authorization', token)
        .send({
            title: 'loira do banheiro', 
            description: 'loira do banheiro', 
            type: 'espírito', 
            location: {
                type: 'Point',
                coordinates: [1, 1]
            }
        });

    const count = await Legend.countDocuments();

    expect(count).toBe(2);
    expect(res.statusCode).toBe(201);
});

test('Buscar lendas', async () => {
    const res = await request(app)
        .get('/legends');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeDefined();
})

test('Buscar minhas lendas', async () => {
    const res = await request(app)
        .get('/legends/mylegends')
        .set('Authorization', token)

    const legends = res.body;

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].postedBy).toBe('user');
})

test('Procurar lendas', async () => {
    const res = await request(app)
        .post('/legends/search')
        .query({query: 'monstro'});

    const legends = res.body;

    expect(res.statusCode).toBe(200);
    expect(legends.length).toBe(1);
    expect(legends[0].type).toBe('monstro');
})