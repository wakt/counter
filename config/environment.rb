require 'mail'

# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Counter::Application.initialize!

#Counter::Application.config.simplyurl = "http://yard.fastfuels.com:3001/"
Counter::Application.config.baseurl = "http://yard.fastfuels.com"
Counter::Application.config.simplyurl = Counter::Application.config.baseurl + ":" + Counter::Application.config.simplyurlport + "/"
Counter::Application.config.counterurl = "http://yard.fastfuels.com/"
Counter::Application.config.printinvoices = true
Counter::Application.config.mailinvoices = false
Counter::Application.config.printername = "Microsoft XPS Document Writer"
#Counter::Application.config.acrordcmd = "\"c:\\program files (x86)\\adobe\\reader 10.0\\reader\\acrord32.exe\" /t c:\\apps\\counter\\public\\invoices\\%s.pdf \"#{Counter::Application.config.printername}\""
#Counter::Application.config.acrordcmd = "\"c:\\program files\\adobe\\reader 11.0\\reader\\acrord32.exe\" /t c:\\users\\dan\\counter\\public\\invoices\\%s.pdf \"#{Counter::Application.config.printername}\""
Counter::Application.config.acrordcmd = "c:\\users\\dan\\counter\\public\\invoice\\printinvoice.bat " "c:\\users\\dan\\counter\\public\\invoice\\%s.pdf"

options = { :address              => "smtp.gmail.com",
            :port                 => 587,
            :domain               => 'yard.fastfuels.com',
            :user_name            => 'dandbw@gmail.com',
            :password             => 'Purple99',
            :authentication       => 'plain',
            :enable_starttls_auto => true  }

Mail.defaults do
  delivery_method :smtp, options
end

Counter::Application.config.invoicefrom = "dandbw@gmail.com"
Counter::Application.config.invoiceto = "dandbw@gmail.com"
