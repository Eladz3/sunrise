namespace SunriseApi.Models.Entities
{
    public abstract class BaseEntity
    {
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public DateTime? ModifiedOn { get; set; }
        public int? ModifiedBy { get; set; }

        public DateTime? DeletedOn { get; set; }
        public int? DeletedBy { get; set; }
    }
}