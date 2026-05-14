using AutoMapper;
using SunriseApi.Models.Entities;
using SunriseApi.Models.Requests;

namespace SunriseApi.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateNewGoalRequest, Goal>().ReverseMap();
            CreateMap<CreateNewUserRequest, User>().ReverseMap();
        }
    }
}