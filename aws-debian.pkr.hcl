packer {
  required_plugins {
    amazon = {
      version = " >= 1.2.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-06db4d78cb1d3bbf9"
}

variable "ssh_username" {
  type    = string
  default = "admin"
}

variable "subnet_id" {
  type    = string
  default = "subnet-093b9373b64b56fa1"
}

source "amazon-ebs" "awsdebian" {
  # ami_name      = "csye6225_${formatdate("YYYY-MM-DD HH:mm:ss", timestamp())}"
  ami_name = "csye6225"
  ami_description = "AMI for CSYE6225"
  region          = "us-east-1"

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50

  }

  instance_type = "t2.micro"
  source_ami    = "ami-06db4d78cb1d3bbf9"
  ssh_username  = "admin"
  subnet_id     = "${var.subnet_id}"


  launch_block_device_mappings {
      device_name           = "/dev/xvda"
      volume_size           = 25
      volume_type           = "gp2"
      delete_on_termination = true
    }
}

build {
  name = "learn-packer"
  sources = [
    "source.amazon-ebs.awsdebian"
  ]

  # provisioner "shell" {
  #    environment_vars = [
  #    "DEBIAN_FRONTEND=noninteractive",
  #    "CHECKPOINT_DISABLE=1"
  #     ]
  #    inline = [
  # "echo Installing Node.js",
  #  "sleep 30",
  # "sudo apt-get update",
  # "sudo apt-get install nodejs -y",
  # "sudo apt-get install uninstall -y",
  #    ]
  # }
}
