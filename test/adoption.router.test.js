// test/adoption.router.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let mongod;

const appFactory = require('../src/app'); // asumimos que exportás app (sin listen)
const User = require('../src/models/user.model');
const Pet = require('../src/models/pet.model');
const Adoption = require('../src/models/adoption.model');

let app;

beforeAll(async () => {
  jest.setTimeout(60000);
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // inicializamos la app después de conectar la BD
  app = appFactory();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

beforeEach(async () => {
  // limpiar colecciones
  await User.deleteMany({});
  await Pet.deleteMany({});
  await Adoption.deleteMany({});
});

describe('Adoption Router — funcional', () => {
  test('POST /api/adoptions  - crear adoption válida', async () => {
    // crear user y pet
    const user = await User.create({ first_name: 'A', last_name: 'B', email: 'a@b.com', age: 30, password: 'x', role: 'user', pets: [] });
    const pet = await Pet.create({ name: 'Fido', species: 'dog', age: 3 });

    const res = await request(app)
      .post('/api/adoptions')
      .send({ pet: pet._id.toString(), adopter: user._id.toString(), notes: 'Quiero adoptarlo' })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.payload).toHaveProperty('_id');
    expect(res.body.payload.pet).toBe(pet._id.toString());
    expect(res.body.payload.adopter).toBe(user._id.toString());
  });

  test('POST /api/adoptions - retorna 400 si faltan campos', async () => {
    const res = await request(app).post('/api/adoptions').send({}).expect(400);
    expect(res.body.status).toBe('error');
  });

  test('POST /api/adoptions - 404 si pet o user no existe', async () => {
    // pet inexistente
    const user = await User.create({ first_name: 'A', last_name: 'B', email: 'u@u.com', age: 25, password: 'x', role: 'user', pets: [] });
    const fakeId = mongoose.Types.ObjectId();

    const res = await request(app)
      .post('/api/adoptions')
      .send({ pet: fakeId.toString(), adopter: user._id.toString() })
      .expect(404);
    expect(res.body.message).toBe('PetNotFound' || res.body.message === 'UserNotFound');
  });

  test('GET /api/adoptions - lista todas (vacio inicialmente)', async () => {
    const res = await request(app).get('/api/adoptions').expect(200);
    expect(res.body.status).toBe('success');
    expect(Array.isArray(res.body.payload)).toBe(true);
    expect(res.body.payload.length).toBe(0);
  });

  test('GET /api/adoptions/:id - 404 para id inexistente', async () => {
    const fakeId = mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/adoptions/${fakeId}`).expect(404);
    expect(res.body.status).toBe('error');
  });

  test('PUT /api/adoptions/:id - actualizar status correctamente', async () => {
    const user = await User.create({ first_name: 'AA', last_name: 'BB', email: 'aa@bb.com', age: 28, password: 'x', role: 'user', pets: [] });
    const pet = await Pet.create({ name: 'Milo', species: 'cat', age: 2 });
    const adoption = await Adoption.create({ pet: pet._id, adopter: user._id });

    const res = await request(app)
      .put(`/api/adoptions/${adoption._id}`)
      .send({ status: 'approved', notes: 'Check OK' })
      .expect(200);

    expect(res.body.payload.status).toBe('approved');
    expect(res.body.payload.notes).toBe('Check OK');
    expect(res.body.payload).toHaveProperty('processedAt');
  });

  test('PUT /api/adoptions/:id - 400 status invalido', async () => {
    const user = await User.create({ first_name: 'AA', last_name: 'BB', email: 'xx@xx.com', age: 28, password: 'x', role: 'user', pets: [] });
    const pet = await Pet.create({ name: 'Coco', species: 'bird', age: 1 });
    const adoption = await Adoption.create({ pet: pet._id, adopter: user._id });

    const res = await request(app)
      .put(`/api/adoptions/${adoption._id}`)
      .send({ status: 'notvalid' })
      .expect(400);

    expect(res.body.status).toBe('error');
  });

  test('DELETE /api/adoptions/:id - elimina adoption', async () => {
    const user = await User.create({ first_name: 'D', last_name: 'E', email: 'd@e.com', age: 31, password: 'x', role: 'user', pets: [] });
    const pet = await Pet.create({ name: 'Bella', species: 'dog', age: 4 });
    const adoption = await Adoption.create({ pet: pet._id, adopter: user._id });

    await request(app).delete(`/api/adoptions/${adoption._id}`).expect(200);

    const found = await Adoption.findById(adoption._id);
    expect(found).toBeNull();
  });

  test('DELETE /api/adoptions/:id - 404 si no existe', async () => {
    const fakeId = mongoose.Types.ObjectId();
    const res = await request(app).delete(`/api/adoptions/${fakeId}`).expect(404);
    expect(res.body.status).toBe('error');
  });
});
