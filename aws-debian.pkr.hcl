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

variable "PASSWORD" {
  type    = string
  default = "${env("PASSWORD")}"
}

variable "DATABASE" {
  type    = string
  default = "${env("DATABASE")}"
}

variable "USER" {
  type    = string
  default = "${env("USER")}"
}


source "amazon-ebs" "awsdebian" {
  source_ami_filter {
    most_recent = true

    filters = {
      name                = "debian-12-amd64*"
      architecture        = "x86_64"
      root-device-name    = "/dev/xvda"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    owners = ["amazon"]
  }

  # ami_name      = "csye6225_${formatdate("YYYY-MM-DD HH:mm:ss", timestamp())}"
  ami_name        = "csye6225"
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
  sources = [
    "source.amazon-ebs.awsdebian"
  ]

  provisioner "file" {
    source      = "./users.csv"
    destination = "/home/admin/users.csv"
  }

  provisioner "file" {
    source      = "./webapp.zip"
    destination = "/home/admin/webapp.zip"
  }

  provisioner "shell" {
    script = "./setup.sh"
    environment_vars = [
      "PASSWORD=${var.PASSWORD}",
      "DATABASE=${var.DATABASE}",
      "USER=${var.USER}",
    ]
  }
}
