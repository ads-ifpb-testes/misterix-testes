import httpMocks from 'node-mocks-http';
import { checkLegendModel } from '../../../middlewares.js';

const res = httpMocks.createResponse();
const next = jest.fn();

test('Modelo válido', () => {
    const req = httpMocks.createRequest({
        body: {
            title: 'test',
            description: 'test', 
            type: 'test', 
            location: {
                type: 'Point', 
                coordinates: [1, 1]
            }
        }
    })

    checkLegendModel(req, res, next);

    expect(res.locals.legend).toBeDefined();
    expect(next).toHaveBeenCalled();
});

describe('Testando campos', () => {
    test('Modelo inválido sem título', () => {
        const req = httpMocks.createRequest({
            body: {
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Point', 
                    coordinates: [1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido sem descrição', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test', 
                type: 'test', 
                location: {
                    type: 'Point', 
                    coordinates: [1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido sem tipo', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                location: {
                    type: 'Point', 
                    coordinates: [1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido sem localização', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test',
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido com localização sem tipo', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test', 
                location: {
                    coordinates: [1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido com tipo de localização diferente de "Point"', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Line', 
                    coordinates: [1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido com localização sem coordenadas', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Point'
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });

    test('Modelo inválido com localização com menos de 2 coordenadas', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Point', 
                    coordinates: [1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });
    
    test('Modelo inválido com localização com mais de 2 coordenadas', () => {
        const req = httpMocks.createRequest({
            body: {
                title: 'test',
                description: 'test', 
                type: 'test', 
                location: {
                    type: 'Point', 
                    coordinates: [1, 1, 1]
                }
            }
        })
    
        checkLegendModel(req, res, next);
    
        expect(res.statusCode).toBe(400);
        expect(next).not.toHaveBeenCalled();
    });
})