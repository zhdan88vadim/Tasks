using DataServer.DatabaseAccess;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
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


        private async Task SaveFileToDisk(HttpContent fileContent)
        {
            var filename = fileContent.Headers.ContentDisposition.FileName.Trim('\"');
            var buffer = await fileContent.ReadAsByteArrayAsync();
            string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedFiles"), filename);
            var saveStream = new MemoryStream(buffer);
            saveStream.Position = 0;
            using (var fileStream = System.IO.File.Create(fileSavePath))
            {
                saveStream.CopyTo(fileStream);
            }
        }


        // POST api/userapi
        public async Task<bool> Post(string user)
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var provider = new MultipartMemoryStreamProvider();
            await Request.Content.ReadAsMultipartAsync(provider);

            var fileContent = provider.Contents.FirstOrDefault(x => x.Headers.ContentDisposition.FileName != null);
            await SaveFileToDisk(fileContent);

            var fieldNameContent = provider.Contents.FirstOrDefault(x => x.Headers.ContentDisposition.Name == "Name");


            //foreach (var file in provider.Contents)
            //{
            //    var filename = file.Headers.ContentDisposition.FileName.Trim('\"');
            //    var buffer = await file.ReadAsByteArrayAsync();
            //    string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/UploadedFiles"), filename);
            //    var saveStream = new MemoryStream(buffer);
            //    saveStream.Position = 0;
            //    using (var fileStream = System.IO.File.Create(fileSavePath))
            //    {
            //         saveStream.CopyTo(fileStream);  
            //    }
            //}

            return true;

            //return userRepository.Update(value);
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
