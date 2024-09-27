import {generateAccessToken} from '../../../service/jwtService.js'
import { verify } from 'jsonwebtoken';
import 'dotenv/config'

test('Gerar token jwt', () => {
    const token = generateAccessToken('test');
    const payload = verify(token, process.env.TOKEN_SECRET);
    
    expect(payload.data).toBeDefined();
    expect(payload.data).toBe('test');
});