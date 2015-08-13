using DataServer.DatabaseAccess;
using System;
using System.Collections.Generic;
using System.Diagnostics;
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
        UserRepository _userRepository;

        public UserController()
        {
            _userRepository = new UserRepository(new DataServerEntities());
        }

        // GET api/userapi
        public IEnumerable<User> Get()
        {
            return _userRepository.GetAll().ToArray();
        }

        // GET api/userapi/5
        public User Get(int id)
        {
            return _userRepository.Get(id);
        }

        // POST api/userapi
        public async Task<bool> Post()
        {
            if (!Request.Content.IsMimeMultipartContent())
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var formDataProvider = new MultipartFormDataStreamProvider(root);

            await Request.Content.ReadAsMultipartAsync(formDataProvider);

            string imagePath = string.Empty;

            if (formDataProvider.FileData.Count > 0)
            {
                MultipartFileData file = formDataProvider.FileData[0];
                string fileName = string.Format("{0}_{1}", Guid.NewGuid().ToString("N"), file.Headers.ContentDisposition.FileName.Replace("\"", "")); /* TODO Replace is not good. */
                string fileSavePath = Path.Combine(HttpContext.Current.Server.MapPath("~/Content/UploadedFiles"), fileName);
                System.IO.File.Move(file.LocalFileName, fileSavePath);
                
                imagePath = VirtualPathUtility.ToAbsolute(string.Format(@"~/Content/UploadedFiles/{0}", fileName));
            }

            string userID = formDataProvider.FormData.GetValues("ID")[0];
            string userName = formDataProvider.FormData.GetValues("Name")[0];
            string userEmail = formDataProvider.FormData.GetValues("Email")[0];
            string userPhone = formDataProvider.FormData.GetValues("Phone")[0];
            string userPassword = formDataProvider.FormData.GetValues("Password")[0];

            var user = new User() { 
                ID = int.Parse(userID),
                Name = userName, 
                Email = userEmail, 
                Phone = userPhone, 
                Password = userPassword, 
                Image = imagePath };

            return _userRepository.Update(user);
        }

        // PUT api/userapi/5
        public void Put(int id, [FromBody]User value)
        {
            _userRepository.Add(value);
        }

        // DELETE api/userapi/5
        public void Delete(int id)
        {
            _userRepository.Delete(id);
        }
    }
}
