import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "src/models";

jest.setTimeout(30000); // tăng timeout cả file lên 30s

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );

    await app.init();

    // listen trên cổng 0 để OS tự pick cổng trống -> tránh conflict
    await app.listen(0);
    baseUrl = await app.getUrl(); // ví dụ: http://127.0.0.1:xxxxx

    // cấu hình pactum dùng base url này
    pactum.request.setBaseUrl(baseUrl);

    // lấy prisma service và clean db (giữ nguyên method cleanDb giả sử bạn đã có)
    prisma = app.get(PrismaService);
    if (prisma && typeof prisma.cleanDb === 'function') {
      await prisma.cleanDb();
    } else {
      // nếu bạn không có cleanDb, có thể implement truncate ở đây hoặc throw thông báo:
      // throw new Error('PrismaService.cleanDb() not found. Implement DB cleaning for tests.');
    }
  }, 30000); // timeout cho beforeAll riêng nếu cần

  afterAll(async () => {
    // đóng app và disconnect prisma
    if (prisma && typeof prisma.$disconnect === 'function') {
      await prisma.$disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'sadqwfewf@gmail.com',
      password: 'sadqewg',
    };

    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin') // sửa đúng route signin
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });

      it('should throw if no body', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(201)
          .stores('userAccess', 'access_token'); // lưu token từ response.access_token
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get me', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAccess}',
          })
          .expectStatus(200);
      });
    });
  });

  describe('Bookmarks', () => {
    // thêm test bookmarks ở đây
  });

  it.todo('should pass');
});
