import {deleteLegend, getLegends, getMyLegends, postLegend, updateLegend} from '../../../controller/legendController.js';
import httpMocks from 'node-mocks-http';
import redisClient from '../../../data/redis.js';
import Legend from '../../../model/mongooseLegend.js';
jest.mock('../../../data/redis.js');
jest.mock('../../../model/mongooseLegend.js');

const redisGetMock = jest.spyOn(redisClient, 'get');
const redisSetMock = jest.spyOn(redisClient, 'set');
const redisDelMock = jest.spyOn(redisClient, 'del');

const legendFindMock = jest.spyOn(Legend, 'find');
const legendCreateMock = jest.spyOn(Legend, 'create');
const legendFindByIdMock = jest.spyOn(Legend, 'findById');
const legendFindByIdAndUpdateMock = jest.spyOn(Legend, 'findByIdAndUpdate');
const legendFindByIdAndDeleteMock = jest.spyOn(Legend, 'findByIdAndDelete');

const db = [{title: 'legend', postedBy: 'user'}];
let cache = undefined;
let req, res;

beforeEach(() => {
    req = httpMocks.createRequest({
        params: {id: 1}
    });
    res = httpMocks.createResponse({
        locals: {
            login: 'user', 
            legend: {
                title: 'test', 
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Point',
                    coordinates: [1, 1]
                }
            }
        }
    });
    
    
    redisGetMock.mockImplementation(() => cache);
    redisSetMock.mockImplementation((cl, json) => jest.fn());
    redisDelMock.mockImplementation(jest.fn());

    legendFindMock.mockImplementation(() => db);
    legendCreateMock.mockImplementation((legend) => {});
    legendFindByIdMock.mockImplementation((id) => {return {}});
    legendFindByIdAndUpdateMock.mockImplementation((id, legend) => {});
    legendFindByIdAndDeleteMock.mockImplementation((id) => {});
});

afterAll(() => {
    jest.clearAllMocks();
})

test('Buscar lendas no banco', async () => {
    await getLegends(req, res);

    expect(redisGetMock).toHaveBeenCalledWith('LEGENDS');
    expect(legendFindMock).toHaveBeenCalledWith({});
    expect(redisSetMock).toHaveBeenCalledWith('LEGENDS', JSON.stringify(db));
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(db);
});

test('Buscar lendas no cache', async () => {
    cache = JSON.stringify(db);

    await getLegends(req, res);

    expect(redisGetMock).toHaveBeenCalledWith('LEGENDS');
    expect(legendFindMock).not.toHaveBeenCalled();
    expect(redisSetMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(db);
});

test('Buscar lendas de usuário', async () => {
    await getMyLegends(req, res);

    expect(legendFindMock).toHaveBeenCalledWith({postedBy: res.locals.login});
    expect(res.statusCode).toBe(200);
    expect(res._getJSONData()).toEqual(db);
});

test('Postar lenda', async () => {
    const {login} = res.locals;
    const {title, description, type, location} = res.locals.legend;
      
    await postLegend(req, res);

    expect(legendCreateMock).toHaveBeenCalledWith({title, description, type, location, postedBy: login});
    expect(redisDelMock).toHaveBeenCalledWith('LEGENDS');
    expect(res.statusCode).toBe(201);
});

test('Alterar lenda', async () => {
    await updateLegend(req, res);

    expect(legendFindByIdMock).toHaveBeenCalledWith(req.params.id);
    expect(legendFindByIdAndUpdateMock).toHaveBeenCalledWith(req.params.id, res.locals.legend);
    expect(redisDelMock).toHaveBeenCalledWith('LEGENDS');
    expect(res.statusCode).toBe(200);
});

test('Alterar lenda com id inválido', async () => {
    legendFindByIdMock.mockImplementation(() => {});

    await updateLegend(req, res);

    expect(legendFindByIdMock).toHaveBeenCalledWith(req.params.id);
    expect(legendFindByIdAndUpdateMock).not.toHaveBeenCalled();
    expect(redisDelMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
});

test('Deletar lenda', async () => {
    await deleteLegend(req, res);

    expect(legendFindByIdMock).toHaveBeenCalledWith(req.params.id);
    expect(legendFindByIdAndDeleteMock).toHaveBeenCalledWith(req.params.id);
    expect(redisDelMock).toHaveBeenCalledWith('LEGENDS');
    expect(res.statusCode).toBe(200);
});

test('Deletar lenda com id inválido', async () => {
    legendFindByIdMock.mockImplementation(() => {});

    await deleteLegend(req, res);

    expect(legendFindByIdMock).toHaveBeenCalledWith(req.params.id);
    expect(legendFindByIdAndDeleteMock).not.toHaveBeenCalled();
    expect(redisDelMock).not.toHaveBeenCalled();
    expect(res.statusCode).toBe(404);
});