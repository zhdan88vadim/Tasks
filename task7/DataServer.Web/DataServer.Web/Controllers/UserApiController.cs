using DataServer.DatabaseAccess;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace DataServer.Web.Controllers
{
    public class UserApiController : ApiController
    {

        UserRepository userRepository = new UserRepository();

        // GET api/userapi
        public IEnumerable<string> Get()
        {
            data.Users.

            return new string[] { "value1", "value2" };
        }

        // GET api/userapi/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/userapi
        public void Post([FromBody]string value)
        {
        }

        // PUT api/userapi/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/userapi/5
        public void Delete(int id)
        {
        }
    }
}
