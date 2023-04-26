import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '<p>APIs for FOMS! <a href="https://github.com/AbdullahDev0/Food-Order-Management-System"> GitHub </a> </p>';
  }
}
