using DataServer.DatabaseAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DataServer.Web.Controllers
{
    public class UserController : ApiController
    {

        UserRepository userRepository = new UserRepository();

        // GET api/userapi
        public IEnumerable<User> Get()
        {
            return userRepository.GetAll().ToArray();
            
            //return new string[] { "value1", "value2" };
        }

        // GET api/userapi/5
        public User Get(int id)
        {
            return userRepository.Get(id);
        }

        // POST api/userapi
        public bool Post([FromBody]User value)
        {
            return userRepository.Update(value);
        }

        // PUT api/userapi/5
        public void Put(int id, [FromBody]User value)
        {
            userRepository.Add(value);
        }

        // DELETE api/userapi/5
        public void Delete(int id)
        {
            userRepository.Delete(id);
        }
    }
}
