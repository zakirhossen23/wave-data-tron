// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/Strings.sol";

contract WaveData {

    /// User contains all the login information
    struct user_struct { 
        /// The ID of the User ID.
        uint256 user_id;
        ///Full Name of user
        string name;
        ///Email of user
        string email;
        ///Password of user
        string password;
    }
    
     /// Trial Struct contains all the trial information
    struct trial_struct { 
        /// The ID of the Trial ID.
        uint256 trial_id;
        /// The ID of the User ID.
        uint256 user_id;
        /// The Image of the Trial
        string image;
        /// The Title of the Trial
        string title;
        /// The Description of the Trial
        string description;
        /// The Contributors of the Trial
        uint256 contributors;
        /// The Audience of the Trial
        uint256 audience;
        /// The Budget of the Trial
        uint256 budget;
        /// The Date of the Trial
        string date;
    }
    
     /// Reward Struct for storing rewared information in the trial 
    struct reward_struct { 
        /// The ID of the Trial ID.
        uint256 trial_id;
        /// The ID of the User ID.
        uint256 user_id;
        /// The Type of the Reward.
        string reward_type;
        /// The Price of the Reward.
        uint256 reward_price;
        /// The Total Spending Limit of the Trial.
        uint256 total_spending_limit;
    }
    
       /// Reward Struct for storing rewared information in the trial 
    struct reward_struct { 
        /// The ID of the Trial ID.
        uint256 trial_id;
        /// The ID of the User ID.
        uint256 user_id;
        /// The Type of the Reward.
        string reward_type;
        /// The Price of the Reward.
        uint256 reward_price;
        /// The Total Spending Limit of the Trial.
        uint256 total_spending_limit;
    }
    
    
    /// Survey Struct contains all the survey information
    struct survey_struct { 
        /// The ID of the Survey ID.
        uint256 survey_id;
        /// The ID of the Trial ID.
        uint256 trial_id;
        /// The ID of the User ID.
        uint256 user_id;
        /// The Name of the Survey
        string name;
        /// The Description of the Survey
        string description;
        /// The Date of the Survey
        string date;
        /// The Image of the Survey
        string image;
        /// The Reward of the Survey
        uint256 reward; 
        /// The Submission of the Survey
        uint256 submission;
    }
     
     
     
   
    
	uint256 public _UserIds;
	uint256 public _TrialIds;
	uint256 public _SurveyIds;
	 /// The map of all the Users login information.
	mapping(uint256 => user_struct) private _userMap;  
	 /// The map of all the Trials information.
	mapping(uint256 => trial_struct) public _trialMap;  
	 /// The map of all the Rewards information.
	mapping(uint256 => reward_struct) public _trialRewardMap;  
	 /// The map of all the Surveys information.
	mapping(uint256 => survey_struct) public _surveyMap;  
	
	address public owner;


    //Login User
    function CheckEmail(string memory email)
		public 
		view
		returns (string memory )
	{

        ///Getting the found account
		for (uint256 i = 0; i < _UserIds; i++) {
		    	if (
				keccak256(bytes(_userMap[i].email)) ==
				keccak256(bytes(email))
			) {
			    ///Returning user id 
				return Strings.toString(i);
			}
		  
		}

        ///Returning False if not found user
		return "False";
	}


    //CreateAccount
    function CreateAccount(
		string memory full_name,
		string memory email,
		string memory password
	) public   {	
	    
	    // Store the metadata of user in the map.
	    _userMap[_UserIds] = user_struct({
	        user_id: _UserIds,
	        name: full_name,
	        email: email,
	        password: password
	    });
	    _UserIds++;
	}


    //Login User
    function Login(string memory email,string memory password)
		public 
		view
		returns (string memory )
	{

        ///Getting the found account
		for (uint256 i = 0; i < _UserIds; i++) {
		    	if (
				keccak256(bytes(_userMap[i].email)) ==
				keccak256(bytes(email)) &&
				keccak256(bytes(_userMap[i].password)) ==
				keccak256(bytes(password))
			) {
			    ///Returning user id 
				return Strings.toString(i);
			}
		  
		}

        ///Returning False if not found user
		return "False";
	}

    
    //Create Trial
    function CreateTrial(uint256 user_id, string memory image,string memory title, string memory description, uint256 contributors, uint256 audience, uint256 budget, string memory date) public{
        // Store the metadata of Trial in the map.
	    _trialMap[_TrialIds] = trial_struct({
	         trial_id:_TrialIds,
	         user_id: user_id,
	         image: image,
	         title: title,
	         description: description,
	         contributors: contributors,
	         audience: audience,
	         budget: budget,
	         date: date
	    });
	    
	    // Store the metadata of Reward in the map.
	    _trialRewardMap[_TrialIds] = reward_struct({
	         trial_id:_TrialIds,
	         user_id: user_id,
	         reward_type: "",
	         reward_price: 0,
	         total_spending_limit: budget
	    });
	    _TrialIds++;
    }

  
  
    //Create Survey
    function CreateSurvey(uint256 trial_id,uint256 user_id,string memory name,string memory description,string memory date,string memory image,uint256 reward) public{
        // Store the metadata of Survey in the map.
	    _surveyMap[_SurveyIds] = survey_struct({
	         survey_id:_SurveyIds,
	         trial_id:trial_id,
	         user_id: user_id,
	         name: name,
	         description: description,
	         date: date,
	         image: image,
	         reward: reward,
	         submission: 0
	    });
	    _SurveyIds++;
    }

  
  
    //Update Trial
    function UpdateTrial(uint256 trial_id, string memory image,string memory title, string memory description, uint256 budget) public{
        // Update the metadata of Trial in the map.
	    _trialMap[trial_id].image = image;
	    _trialMap[trial_id].title = title;
	    _trialMap[trial_id].description = description;
	    _trialMap[trial_id].budget = budget;
	    
    }
    

    //Update Survey
    function UpdateSurvey(uint256 survey_id,string memory name,string memory description,string memory image,uint256 reward) public{
        // Update the metadata of Survey in the map.
	    _surveyMap[survey_id].name = name;
	    _surveyMap[survey_id].description = description;
	    _surveyMap[survey_id].image = image;
	    _surveyMap[survey_id].reward = reward;
    }
  
    //Update Reward
    function UpdateReward(uint256 trial_id, 
        string memory reward_type,
        uint256 reward_price,
        uint256 total_spending_limit
    ) public{
        // Update the metadata of Trial in the map.
	    _trialRewardMap[trial_id].reward_type = reward_type;
	    _trialRewardMap[trial_id].reward_price = reward_price;
	    _trialRewardMap[trial_id].total_spending_limit = total_spending_limit;
    }
    

}

 
