import httpMocks from 'node-mocks-http';
import Legend from '../../../model/mongooseLegend.js';
import { checkLegendOwner } from '../../../middlewares.js';

const findByIdMock = jest.spyOn(Legend, 'findById');
findByIdMock.mockImplementation(() => {
    return {postedBy: 'test'};
});

const req = httpMocks.createRequest({
    params: {id: 1}
});
const next = jest.fn();


test('Usuário dono de lenda', async () => {
    const res = httpMocks.createResponse({
        locals: {login: 'test'}
    });

    await checkLegendOwner(req, res, next);
    
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id);
    expect(next).toHaveBeenCalled();
});

test('Usuário não dono de lenda', async () => {
    const res = httpMocks.createResponse({
        locals: {login: 'test1'}
    });

    await checkLegendOwner(req, res, next);
    
    expect(findByIdMock).toHaveBeenCalledWith(req.params.id)
    expect(res.statusCode).toBe(401);
    expect(next).not.toHaveBeenCalled();
});