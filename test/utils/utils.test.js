const request = require('supertest');
const expect = require('expect');
const app = require('../../server').app;



describe('Utils', () => {

    describe('Ping /', () => {
      it('should return a response pong', () => {
        request(app)
          .get('/ping')
          .expect(200)
          .expect((res) => {
            expect(res.body).toMatchObject({
              ping: 'Pong'
            });
          })
          
      });
    });
  
    describe('Version/', () => {
      it('should return a node version number', () => {
        let version={version:process.version}
        request(app)
          .get('/version')
          .expect(200)
          .expect((res) => {
            expect(res.body).toMatchObject({
              version
            });
          })
          
      });
    });
    describe('Invalid Url/', () => {
      let notFound = {message:'Invalid request'};
      it('should return 404', () => {
        request(app)
          .get('/ahdhaueinoeqwr')
          .expect(404)
          .expect((res) => {
            expect(res.body).toMatchObject({
              notFound
            });
          })
          
      });
    });
    
  });