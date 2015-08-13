using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataServer.DatabaseAccess
{
    public class UserRepository
    {
        private readonly DataServerEntities _dbContext;

        public UserRepository(DataServerEntities context)
        {
            _dbContext = context;
        }

        public IEnumerable<User> GetAll()
        {
            var query = _dbContext.Users;
            return query.ToList();
        }

        public User Get(int id)
        {
            return _dbContext.Users.FirstOrDefault(x => x.ID == id);
        }

        public bool Update(User user)
        {
            var item = _dbContext.Users.FirstOrDefault(x => x.ID == user.ID);
            if (item != null)
            {
                item.Name = user.Name;
                item.Email = user.Email;
                item.Phone = user.Phone;
                item.Password = user.Password;
                item.Image = string.IsNullOrWhiteSpace(user.Image) ? item.Image : user.Image;

                _dbContext.SaveChanges();
                
                return true;
            }
            return false;
        }

        public void Add(User user)
        {
            _dbContext.Users.Add(user);
            _dbContext.SaveChanges();
        }

        public void Delete(int id)
        {
            var item = _dbContext.Users.FirstOrDefault(x => x.ID == id);
            if (item != null)
            {
                _dbContext.Users.Remove(item);
                _dbContext.SaveChanges();
            }
        }

    }
}
