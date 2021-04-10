<?php
   
   $myFile = "data/restaurants.json";
   $arr_data = array(); // create empty array

  try
  {
	   //Get form data
	   

	   //Get data from existing json file
	   $jsondata = file_get_contents($myFile);
	   
	   // converts json data into array
	   $arr_data = json_decode($jsondata, true);

	   $arrlength = count($arr_data['restaurants']) + 1;
	   echo $arrlength;

	   $formdata = array(
		'id'=> $arrlength,
		'display' => 'block',
		'name'=> $_POST['resname'],
		'neighborhood'=>$_POST['rescity'],
		'photograph'=>$_POST['resimg'],
		'address'=>$_POST['resaddress'],
		'latlng'=> array(
		   'lat'=> $_POST[lat],
		   'lng'=> $_POST[lng]
		),
		'cuisine_type'=> $_POST['restype'],
		'operating_hours'=> array(
		  'Saturday'=>'6:00 am - 11:00 pm',
		  'Sunday'=>'6:00 am - 11:00 pm',
		  'Monday'=>'6:00 am - 11:00 pm',
		  'Tuesday'=>'6:00 am - 11:00 pm',
		  'Wednesday'=>'6:00 am - 11:00 pm',
		  'Thursday'=>'6:00 am - 11:00 pm',
		  'Friday'=>'6:00 am - 11:00 pm'

		),
	   'reviews'=>array(
		  
	   ) 

	 );

	   // Push user data to array
	   array_push($arr_data['restaurants'],$formdata);

       //Convert updated array to JSON
	   $jsondata = json_encode($arr_data, JSON_PRETTY_PRINT);

	//    echo '<pre>';
	//    print_r($arr_data['restaurants']);
	//    echo '</pre>';
	   
	   //write json data into data.json file
	   if(file_put_contents($myFile, $jsondata)) {
	        echo 'Data successfully saved';
	    }
	   else 
	        echo "error";

   }
   catch (Exception $e) {
            echo 'Caught exception: ',  $e->getMessage(), "\n";
   }

?>