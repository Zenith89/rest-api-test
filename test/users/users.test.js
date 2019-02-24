const request = require('supertest');
const expect = require('expect');
const app = require('../../server').app;



describe('Users', () => {

    describe('nicholas /', (done) => {
      it('should return a response pong', () => {
        request(app)
          .get('/nicholas')
          .expect(200)
        //   .expect((res) => {
            // expect(res.body).toMatchObject({
            //   ping: 'Pong'
            // });
        //   })
        //   .end(done)
          
      });
    });
  
 
    
  });