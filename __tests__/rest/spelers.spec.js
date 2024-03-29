const {tables} = require("../../src/data");
const {withServer} = require('../helpers');

const data = {
  spelers: [
    {
      spelerId: 1,
      naam: 'Test Speler 1', 
      gewicht: 73.2, 
      lengte: 183, 
      positie: 'shooting guard', 
      geboortedatum: new Date(2002, 8, 27),
      teamId: 5,
      auth0id: "unknown"
    }
  ],
  teams: [
    {
      teamId: 5,
      naam: 'Test Team 5',
      clubId: 5
    },
    {
      teamId: 6,
      naam: 'Test Team 6',
      clubId: 6
    }
  ],
  clubs: [
    {
      clubId: 5,
      naam: 'Test Club 5',
      hoofdsponsor: 'Amon',
      voorzitter: 'papa Gentson',
      locatie: 'Henleykaai 83, Gent'
    },
    {
      clubId: 6,
      naam: 'Test Club 6',
      hoofdsponsor: 'Tegels',
      voorzitter: 'papa Donza',
      locatie: 'OCP, Deinze'
    }
  ]
};

const dataToDelete = {
  spelers: [1],
  teams: [5, 6],
  clubs: [5, 6]
};

describe('spelers', () => {
  let request;
  let knex;
  let authHeader;

  withServer(({ knex: k, request: r, authHeader: a }) => {
    knex = k;
    request = r;
    authHeader = a;
  });

  const url = '/api/spelers';

  describe('GET /api/spelers', () => {
    beforeAll(async () => {
      await knex(tables.club).insert(data.clubs);
      await knex(tables.team).insert(data.teams);
      await knex(tables.speler).insert(data.spelers);
    });

    afterAll(async () => {
      await knex(tables.speler).whereIn('spelerId', dataToDelete.spelers).delete();
      await knex(tables.team).whereIn('teamId', dataToDelete.teams).delete();
      await knex(tables.club).whereIn('clubId', dataToDelete.clubs).delete();
    });

    it('should return 200 and return all players', async () => {
      const response = await request.get(url).set('Authorization', authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);
    });
  });
  describe('GET /api/spelers/:id', () => {
    beforeAll(async () => {
      await knex(tables.club).insert(data.clubs);
      await knex(tables.team).insert(data.teams);
      await knex(tables.speler).insert(data.spelers[0]);
    });

    afterAll(async () => {
      await knex(tables.speler).where('spelerId', dataToDelete.spelers[0]).delete();
      await knex(tables.team).whereIn('teamId', dataToDelete.teams).delete();
      await knex(tables.club).whereIn('clubId', dataToDelete.clubs).delete();
    });

    it('it should return 200 and return the requested player', async () => {
      const response = await request.get(`${url}/${data.spelers[0].spelerId}`)
      .set('Authorization', authHeader);
      expect(response.status).toBe(200);
    });
  });

  

  describe('DELETE /api/spelers/:id', () => {
    beforeAll(async () => {
      await knex(tables.club).insert(data.clubs);
      await knex(tables.team).insert(data.teams);
      await knex(tables.speler).insert([{
        spelerId: 6, 
        naam: 'Test Player 6', 
        gewicht: 73.2, 
        lengte: 183, 
        positie: 'shooting guard', 
        geboortedatum: new Date(2002, 8, 27),
        teamId: 5,
        auth0id: "unknown"
      }]);
    });

      afterAll(async () => {
        await knex(tables.team).whereIn('teamId', dataToDelete.teams).delete();
        await knex(tables.club).whereIn('clubId', dataToDelete.clubs).delete();
      });

      it('should respond 204 and return nothing', async () => {
        const response = await request.delete(`${url}/6`).set('Authorization', authHeader);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
  });
});