using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DC4._0Backend.Models
{
    public class ProductHandlingMatrix
    {

     public string Activity { get; set; }

        public string Zone { get; set; }

        public string Site { get; set; }

         public double SmallCube { get;set;}
	 public double MediumCube { get;set;}
	 public double LargeCube { get;set;}

    public double ExtraLargeCube  { get;set;}
	public double SmallWeight  { get;set;}
	public double MediumWeight  { get;set;}
	public double HeavyWeight  { get;set;}
	public double VeryHeavyWeight  { get;set;}
	public double SmallLightFirstFull  { get;set;}
	public double SmallLightFirstSplit  { get;set;}
	public double SmallLightSubsFull  { get;set;}
	public double SmallLightSubsSplit  { get;set;}
	public double SmallMedFirstFull  { get;set;}
	public double SmallMedFirstSplit  { get;set;}
	public double SmallMedSubsFull  { get;set;}
	public double SmallMedSubsSplit  { get;set;}
	public double SmallHeavyFirstFull  { get;set;}
	public double SmallHeavyFirstSplit  { get;set;}
	public double SmallHeavySubsFull  { get;set;}
	public double SmallHeavySubsSplit  { get;set;}
	public double SmallVHeavyFirstFull  { get;set;}
	public double SmallVHeavyFirstSplit  { get;set;}
	public double SmallVHeavySubsFull  { get;set;}
	public double SmallVHeavySubsSplit  { get;set;}
	public double MedLightFirstFull  { get;set;}
	public double MedLightFirstSplit  { get;set;}
	public double MedLightSubsFull  { get;set;}
	public double MedLightSubsSplit  { get;set;}
	public double MedMedFirstFull  { get;set;}
	public double MedMedFirstSplit  { get;set;}
	public double MedMedSubsFull  { get;set;}
	public double MedMedSubsSplit  { get;set;}
	public double MedHeavyFirstFull  { get;set;}
	public double MedHeavyFirstSplit  { get;set;}
	public double MedHeavySubsFull  { get;set;}
	public double MedHeavySubsSplit  { get;set;}
	public double MedVHeavyFirstFull  { get;set;}
	public double MedVHeavyFirstSplit  { get;set;}
	public double MedVHeavySubsFull  { get;set;}
	public double MedVHeavySubsSplit  { get;set;}
	public double LargeLightFirstFull  { get;set;}
	public double LargeLightFirstSplit  { get;set;}
	public double LargeLightSubsFull  { get;set;}
	public double LargeLightSubsSplit  { get;set;}
	public double LargeMedFirstFull  { get;set;}
	public double LargeMedFirstSplit  { get;set;}
	public double LargeMedSubsFull  { get;set;}
	public double LargeMedSubsSplit  { get;set;}
	public double LargeHeavyFirstFull  { get;set;}
	public double LargeHeavyFirstSplit  { get;set;}
	public double LargeHeavySubsFull  { get;set;}
	public double LargeHeavySubsSplit  { get;set;}
	public double LargeVHeavyFirstFull  { get;set;}
	public double LargeVHeavyFirstSplit  { get;set;}
	public double LargeVHeavySubsFull  { get;set;}
	public double LargeVHeavySubsSplit  { get;set;}
	public double XLLightFirstFull  { get;set;}
	public double XLLightFirstSplit  { get;set;}
	public double XLLightSubsFull  { get;set;}
	public double XLLightSubsSplit  { get;set;}
	public double XLMedFirstFull  { get;set;}
	public double XLMedFirstSplit  { get;set;}
	public double XLMedSubsFull  { get;set;}
	public double XLMedSubsSplit  { get;set;}
	public double XLHeavyFirstFull  { get;set;}
	public double XLHeavyFirstSplit  { get;set;}
	public double XLHeavySubsFull  { get;set;}
	public double XLHeavySubsSplit  { get;set;}
	public double XLVHeavyFirstFull  { get;set;}
	public double XLVHeavyFirstSplit  { get;set;}
	public double XLVHeavySubsFull  { get;set;}
	public double XLVHeavySubsSplit  { get;set;}

        public string DCMUser { get; set; }

    }
}